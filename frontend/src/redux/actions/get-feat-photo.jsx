const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {getFeatPhotoInProgress
      , getFeatPhotoSuccess
      , getFeatureAjaxConcluded
      , getTreeInfoConcluded
      , getTreeInfoSuccess
      , displayModal
      , clearModal
      , setTreeInfoOriginal
      , markGetFeatureInfoFailed} from './index.js';
import {MODAL_LOGIN, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';

import {urlForPhoto} from './feature-photo-util.js';



export default function getFeatPhoto(id, idx) {
  const source = CancelToken.source();
  return (dispatch, getState) => {
    const cancelTokenV = cancelToken(getState());
    if (cancelTokenV) {
      cancelTokenV.cancel(OP_NO_LONGER_RELEVANT);
      console.log('abd cancelled previous pending request');
    }



    const url = urlForPhoto(id, idx);

    dispatch (getFeatPhotoInProgress(id, idx, source));
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
      if (err===null) {
        if (t!=null) {
          const {imageBase64, instant} = t; // corr-id: SSE-1585746250
          dispatch(getFeatPhotoSuccess(imageBase64, instant));
        } else {
          console.warn('curiously the photo appears to have been deleted');
          throw 41;
        }
      } else {
        console.error(err.message);
        console.error(err.strServerTrace);
        throw 42;
      }}).catch( err => {
        console.log(JSON.stringify(err));
        console.log(err);
        console.log(err.message);
        console.log(Object.keys(err));
        if (err.message === OP_NO_LONGER_RELEVANT) {
          console.log('fetchPhoto operation is no longer relevant and got cancelled');
        } else if (err.response && err.response.data) {
          // corr-id: SSE-1585746388
          const {code, msg, details} = err.response.data;
          switch(code) {
            case 'JWT-verif-failed':
              throw 43;
              this.props.displayModalLogin( ()=>{this.fetchPhoto();});
              this.setState({serverCallInProgress: LOGGING_IN
                           , error: {message: `JWT verif. failed. Server message is: [${msg}]`
                                   , details: details}});
              break;
            default:
              throw 44;
              this.setState({serverCallInProgress: null
                           , error: {message: `unexpected error code: ${code}`
                                   , details: msg}});
          }
        } else {
          throw 45;
          this.setState({serverCallInProgress: null
                       , error: {message: 'unexpected error - likely a bug'
                               , details: JSON.stringify(err)}});
        }
      });
  }}
  
