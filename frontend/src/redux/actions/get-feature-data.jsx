const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';


import {markGetFeatureInfoInProgress
      , displayModal
      , clearModal
      , setTreeInfoOriginal
      , markGetFeatureInfoFailed} from './index.js';
import {MODAL_LOGIN, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

export default function getFeatureData(id, cancelToken) {
  console.log(`abd getting feature data for ${id}`);
  return (dispatch, getState) => {
    const url = `/feature/${id}/data`;
    console.log(`fetchData, axios URL is: ${url}`);
    if (getState().treeInfo.axiosSource) {
      getState().treeInfo.axiosSource.cancel();
      console.log('abd cancelled previous pending request');
    } else
    console.log('abd no previous pending request found to cancel');
    console.log(cancelToken);
    dispatch (markGetFeatureInfoInProgress(cancelToken));
    axiosAuth.get(url, {cancelToken}
    ).then(res => {
      // corr-id: SSE-1585746250
      console.log(res.data);
      const {t, err} = res.data;
      console.log(t);
      if (err===null) {
        console.log('abd - obtained data, setting it');
        dispatch( setTreeInfoOriginal(t) );
      } else {
        dispatch( markGetFeatureInfoFailed() );
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
      console.error(err);
      if (err.message === OP_NO_LONGER_RELEVANT) {
        console.log(`${url} operation is no longer relevant and got cancelled`);
      } else if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case 'JWT-verif-failed': {
            dispatch( markGetFeatureInfoFailed() );
            dispatch( displayModal(MODAL_LOGIN, {followUpFunction: ()=>{dispatch(getFeatureData(id, cancelToken))}}));
            //                                 dispatch( displayModalLogin( ()=>{this.setState({error: null}); this.fetchData();} );
            //                                   this.props.setTreeInfoOriginal(null);
            /*
               this.setState({error: {message: `JWT verif. failed. Server message is: [${msg}] - waiting for user login`
               , details: details}});
             */
            break;
          }
          default: {
            dispatch( markGetFeatureInfoFailed() );
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
            /*
               this.props.setTreeInfoOriginal(null);
               this.setState({error: {message: `unexpected error code: ${code}`
               , details: msg}});
             */
          }
        }
      } else {
        dispatch(markGetFeatureInfoFailed());
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

        /*
        this.props.setTreeInfoOriginal(null);
        this.setState({
          error: {message: 'unexpected error - likely a bug'
                , details: JSON.stringify(err)}});
        */
      }
    });
  }; // return (dispatch) =>
} // fetchData
