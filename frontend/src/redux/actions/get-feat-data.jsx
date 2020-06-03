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
import {MODAL_LOGIN, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';


import {cancelPendingRequests} from './action-util.js';

export default function getFeatureData(id) {
  console.log(`abe getFeatureData(${id}`);
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
      console.log(res.data);
      const {t, err} = res.data;
      console.log(t);
      if (err===null) {
        console.log('abd - obtained data, setting it');
        dispatch( getTreeInfoSuccess(t) );
      } else {
        dispatch( displayModal(MDL_NOTIFICATION_NO_DISMISS,
                               {html: (<div>
  τ' αρχίδια μου κουνιούνται
                               </div>
                               )}));
        /*
        this.setState({error: {message: `server-side error: ${err.message}`
                             , details: err.strServerTrace}});
        */
      }
    }).catch( err => {
      if (err.message === OP_NO_LONGER_RELEVANT) {
        console.log(`${url} operation is no longer relevant and got cancelled`);
      } else if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case 'JWT-verif-failed': {
            dispatch( displayModal(MODAL_LOGIN, {followUpFunction: ()=>{dispatch(getFeatureData(id))}}));
            break;
          }
          default: {
            dispatch( displayModal(MDL_NOTIFICATION_NO_DISMISS,
                                   {html: (<div>
                                     <h1>
                                     unexpected error code: {code}
                                     </h1>
                                     <p>
                                     {msg}
                                                    </p>
                                                    <p>
                                                      {details}
                                                    </p>
                               </div>
                                   )}));                               
          }
        }
      } else {
        console.log(err);
        dispatch( displayModal(MDL_NOTIFICATION_NO_DISMISS,
                               {html: (<div>
                                 <h1>
                                   unexpected error code -- likely a bug
                                 </h1>
                                 <p>
                                   {JSON.stringify(err)}
                                 </p>
                               </div>
                               )}));                               

      }
    });
  }; // return (dispatch) =>
} // fetchData
