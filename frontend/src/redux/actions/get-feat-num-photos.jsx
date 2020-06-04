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


import {MODAL_LOGIN, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';


import {urlForNumOfPhotos} from './feature-photo-util.js';

import {cancelPendingRequests} from './action-util.js';

export default function getFeatNumPhotos(id) {
  const source = CancelToken.source();
  return (dispatch, getState) => {

    cancelPendingRequests(getState());


    const url = urlForNumOfPhotos(id);

    ///
    
    
    //
    
    dispatch (getFeatNumPhotosInProgress(id, source));
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
        console.log('abd  - gfnp 1');
        dispatch( getFeatNumPhotosSuccess(num));
        if (num > 0) {
          console.log('abd  - gfnp 2');
          dispatch(getFeatPhoto(id, 0));
          }

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
        throw 41;
        this.setState({serverCallInProgress: null
                     , error: {message: `server-side error: ${err.message}`
                             , details: err.strServerTrace}});
      }
    }).catch( err => {
      console.error(err);
      throw 42;
      if (err.message === OP_NO_LONGER_RELEVANT) {
        console.log('fetchNumOfPhotos operation is no longer relevant and got cancelled');
      } else if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case 'JWT-verif-failed':
            this.props.displayModalLogin( ()=>{this.fetchNumOfPhotos();} );
            this.setState({serverCallInProgress: LOGGING_IN
                         , error: {message: `JWT verif. failed. Server message is: [${msg}]`
                                 , details: details}});
            break;
          default:
            this.setState({serverCallInProgress: null
                         , error: {message: `unexpected error code: ${code}`
                                 , details: msg}});
        }
      } else {
        this.setState({serverCallInProgress: null
                     , error: {message: 'unexpected error - likely a bug'
                             , details: JSON.stringify(err)}});
      }
    }) // catch

}}
