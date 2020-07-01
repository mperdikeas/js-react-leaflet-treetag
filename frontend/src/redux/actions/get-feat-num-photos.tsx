import {Dispatch} from 'react';
const {CancelToken} = require('axios');

import chai from '../../util/chai-util.js'
const assert = chai.assert;

import {axiosAuth} from '../../axios-setup.js';
import {getFeatNumPhotosInProgress
      , getFeatureAjaxConcluded
      , getFeatNumPhotosSuccess
      , getFeatPhoto
      , displayModal} from './index.ts';
import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';
import {urlForNumOfPhotos} from './feat-url-util.js';
import {cancelPendingRequests, propsForRetryDialog} from './action-util.tsx';
import {handleAxiosException} from './action-axios-exc-util.ts';
import {RootState} from '../types.ts';
import {BackendResponse} from '../../backend.d.ts';

export default function getFeatNumPhotos(id: number) {
  const actionCreator = `getFeatNumPhotos(${id}`;
  console.log(actionCreator);


  const source = CancelToken.source();
  return (dispatch: Dispatch<any>, getState: ()=>RootState) => {

    cancelPendingRequests(getState());
    const f = ()=>dispatch(getFeatNumPhotos(id));
    dispatch (getFeatNumPhotosInProgress(id, source));
    const url = urlForNumOfPhotos(id);
    console.log(`${actionCreator} :: URL is: ${url}`);
    
    axiosAuth.get(url, {cancelToken: source.token}).then( (res: BackendResponse<number>) => {
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
      if (err !== null) {
        assert.isNull(t)
        console.error(err);
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      } else {
        const num = t;
        dispatch( getFeatNumPhotosSuccess(num));
        if (num > 0) {
          dispatch(getFeatPhoto(id, 0));
        } else
        ; // I don't need to handle this (!?)
      }
    }).catch( (err: any) => handleAxiosException(err, dispatch, f, url, actionCreator)
    );// catch
  }}
