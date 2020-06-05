const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {getFeatNumPhotosInProgress
      , getFeatureAjaxConcluded
      , getFeatNumPhotosSuccess
      , getFeatPhoto
      , displayModal
      , clearModal} from './index.js';


import {MODAL_LOGIN, MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';


import {urlForNumOfPhotos} from './feat-url-util.js';

import {cancelPendingRequests, propsForRetryDialog} from './action-util.jsx';
import {SERVER_ERROR_CODES} from './action-constants.js';

export default function getFeatNumPhotos(id) {
  const actionCreator = `getFeatNumPhotos(${id}`;
  console.log(actionCreator);
  const f = ()=>getFeatNumPhotos(id);

  const source = CancelToken.source();
  return (dispatch, getState) => {

    cancelPendingRequests(getState());

    dispatch (getFeatNumPhotosInProgress(id, source));
    const url = urlForNumOfPhotos(id);
    console.log(`${actionCreator} :: URL is: ${url}`);
    
    axiosAuth.get(url, {cancelToken: source.token}).then(res => {
      dispatch(getFeatureAjaxConcluded());      
      /* SSE-1585746250
       * This is a ValueOrInternalServerExceptionData data type on the server side
       *
       * public class InternalServerExceptionData {
       *
       *    public final String message;
       *    public final String strServerTrace;
       * ...
       */            

      const {t, err} = res.data;
      if (err !== null)
        console.error(err);
      if (err===null) {
        const num = t;
        dispatch( getFeatNumPhotosSuccess(num));
        if (num > 0) {
          dispatch(getFeatPhoto(id, 0));
        } else
        ; // no need to handle this (??)

        /*
        const numOfPhotos = t;
        const currentPhotoIndx = numOfPhotos>0?0:null;
        if (numOfPhotos>0)
          this.setState({serverCallInProgress: GETTING_PHOTO
                       , numOfPhotos: numOfPhotos
                       , currentPhotoIndx: 0
                       , error: null});
        else
          this.setState({serverCallInProgress: null
                       , numOfPhotos: 0
                       , currentPhotoIndx: null
                       , photoBase64: null
                       , photoBase64Instant: null
                       , error: null});
         */
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      }
    }).catch( err => {
      if (err.message === OP_NO_LONGER_RELEVANT) {
        console.log(`${url} operation in ${actionCreator} is no longer relevant and got cancelled`);
      } else if (err.response && err.response.data) {
        // corr-id: SSE-1585746388
        const {code, msg, details} = err.response.data;
        switch(code) {
          case SERVER_ERROR_CODES.JWT_VERIF_FAILED: {
            dispatch( displayModal(MODAL_LOGIN, {followUpFunction: ()=>{dispatch(f())}}) );
            break;
          }
          default:
            console.error(err.response);
            console.error(err.response.data);
            dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, `unrec code: ${code}`, err.response.data)) );
        } // switch
      } else {
        console.error(err);
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'unrec err shape', err)));
      }
    }); // catch
}}
