const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {getTreeInfoInProgress
      , getFeatureAjaxConcluded
      , getTreeInfoSuccess
      , displayModal
      , clearModal} from './index.js';
import {MODAL_LOGIN, MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';

import {urlForFeatData} from './feat-url-util.js';

import {cancelPendingRequests, propsForRetryDialog} from './action-util.jsx';

import {SERVER_ERROR_CODES} from './action-constants.js';



export default function getFeatureData(id) {
  const actionCreator = `getFeatureData(${id})`;
  console.log(actionCreator);
  const f = ()=>getFeatureData(id);

  const source = CancelToken.source();
  return (dispatch, getState) => {
    cancelPendingRequests(getState());

    dispatch (getTreeInfoInProgress(id, source));
    const url = urlForFeatData(id);
    console.log(`${actionCreator} :: URL is: ${url}`);

    axiosAuth.get(url, {cancelToken: source.token}
    ).then(res => {
      dispatch(getFeatureAjaxConcluded());
      // corr-id: SSE-1585746250
      const {t, err} = res.data;
      if (err===null) {
        dispatch( getTreeInfoSuccess(t) );
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      }
    }).catch( err => {
      if (err.message === OP_NO_LONGER_RELEVANT) {
        console.log('fetchNumOfPhotos operation is no longer relevant and got cancelled');
      } else if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case SERVER_ERROR_CODES.JWT_VERIF_FAILED: {
            dispatch( displayModal(MODAL_LOGIN, {followUpFunction: ()=>{dispatch(f())}}) );
            break;
          }
          default: {
            console.error(err.response);
            console.error(err.response.data);
            dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, `unrec code: ${code}`, err.response.data)) );
          }
        } // switch
      } else {
        console.error(err);
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'unrec err shape', err)));
      }
    });
  }; // return (dispatch) =>
} // fetchData
