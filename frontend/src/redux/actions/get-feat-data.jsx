const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {getTreeInfoInProgress
      , getFeatureAjaxConcluded
      , getTreeInfoSuccess
      , displayModal
      , clearModal
      , setTreeInfoOriginal
      , markGetFeatureInfoFailed} from './index.js';
import {MODAL_LOGIN
      , MDL_RETRY_CANCEL
      , MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';


import {cancelPendingRequests} from './action-util.js';

import {SERVER_ERROR_CODES} from './action-constants.js';


function propsForRetryDialog(dispatch, url, id, ctx, err) {
  function htmlForErrorMessage(url, id, err) {
    return (
      <>
      <div>
        Some server-side problem was encountered while accessing:<br/>
        <span style={{fontFamily:'monospace'}}>{url}</span>
      </div>
      <div style={{marginBottom: '1em'}}>
        If the problem persists, contact support with the below details:
      </div>
      <div style={{border: '1px solid black'}}>
        action-creator: getFeatureData({id})
      </div>
      <div style={{borderLeft: '1px solid black', borderRight: '1px solid black', borderBottom: '1px solid black'}}>
        context: {ctx}
      </div>
      <div style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>
        time: {(new Date()).getTime()/1000}
      </div>
      <div style={{border: '1px solid black'
                 , padding: '0.3em'
                 , background: 'gainsboro'
                 , color: 'red'
                 , fontSize: '110%'
                 , overflowX: 'auto'
                 , fontFamily: 'monospace'}}>
        {JSON.stringify(err)}
      </div>
      </>
    );
  }
  const html = htmlForErrorMessage(url, id, err);
  const cancelAction = ()=>dispatch(clearModal());
  const retryAction = ()=>{dispatch(clearModal()); dispatch(getFeatureData(id));};
  return {html, cancelAction, retryAction};
}

export default function getFeatureData(id) {
  console.log(`getFeatureData(${id}`);
  const source = CancelToken.source();
  return (dispatch, getState) => {
    cancelPendingRequests(getState());

    dispatch (getTreeInfoInProgress(id, source));
    const url = `/feature/${id}/data`;
    console.log(`fetchData, axios URL is: ${url}`);

    axiosAuth.get(url, {cancelToken: source.token}
    ).then(res => {
      dispatch(getFeatureAjaxConcluded());
      // corr-id: SSE-1585746250
      const {t, err} = res.data;
      if (err===null) {
        dispatch( getTreeInfoSuccess(t) );
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, url, id, 'server-side error', err)) );
      }
    }).catch( err => {
      if (err.message === OP_NO_LONGER_RELEVANT) {
        console.log(`${url} operation is no longer relevant and got cancelled`);
      } else if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case SERVER_ERROR_CODES.JWT_VERIF_FAILED: {
            dispatch( displayModal(MODAL_LOGIN, {followUpFunction: ()=>{dispatch(getFeatureData(id))}}));
            break;
          }
          default: {
            console.error(err.response);
            console.error(err.response.data);
            dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, url, id, `unrec code: ${code}`, err.response.data)) );
          }
        } // switch
      } else {
        console.log(err);
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, url, id, 'unrec err shape', err.response.data)) );        
      }
    });
  }; // return (dispatch) =>
} // fetchData
