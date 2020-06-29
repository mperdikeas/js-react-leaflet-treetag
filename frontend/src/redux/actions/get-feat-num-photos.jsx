const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {getFeatNumPhotosInProgress
      , getFeatureAjaxConcluded
      , getFeatNumPhotosSuccess
      , getFeatPhoto
      , displayModal} from './index.ts';


import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {cancelToken} from '../selectors.ts';

import {urlForNumOfPhotos} from './feat-url-util.js';

import {cancelPendingRequests, propsForRetryDialog} from './action-util.tsx';

import {handleAxiosException} from './action-axios-exc-util.ts';

export default function getFeatNumPhotos(id) {
  const actionCreator = `getFeatNumPhotos(${id}`;
  console.log(actionCreator);


  const source = CancelToken.source();
  return (dispatch, getState) => {

    cancelPendingRequests(getState());
    const f = ()=>dispatch(getFeatNumPhotos(id));
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
        ; // I don't need to handle this (!?)
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      }
    }).catch(err => handleAxiosException(err, dispatch, f, url, actionCreator)
    );// catch
  }}
