import {Dispatch} from 'react';
import CancelToken from '../../../node_modules/axios/lib/cancel/CancelToken.js';

import chai from '../../util/chai-util.js'
const assert = chai.assert;


import {axiosAuth} from '../../axios-setup.js';

import {getFeatPhotoInProgress
      , getFeatPhotoSuccess
      , getFeatureAjaxConcluded
      , displayModal} from './index.ts';
import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {urlForPhoto} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.tsx';

import {handleAxiosException} from './action-axios-exc-util.ts';
import {propsForRetryDialog} from './action-util.tsx';

import {RootState} from '../types.ts';
import {BackendResponse} from '../../backend.d.ts';

export default function getFeatPhoto(id: number, idx: number) {
  const actionCreator = `getFeatPhoto(${id}, ${idx})`;
  assert.isTrue(idx>=0,`${actionCreator} idx value of [${idx}] is not GTE 0`);

  const source = CancelToken.source();
  return (dispatch: Dispatch<any>, getState: ()=>RootState) => {

    cancelPendingRequests(getState());
    const f = ()=>dispatch(getFeatPhoto(id, idx));
    dispatch (getFeatPhotoInProgress(id, idx, source));
    const url = urlForPhoto(id, idx);
    console.log(`${actionCreator} :: URL is: ${url}`);

    axiosAuth.get(url, {cancelToken: source.token}).then((res: BackendResponse) => {
      dispatch(getFeatureAjaxConcluded());
      // corr-id: SSE-1585746250
      const {t, err} = res.data; 
      if (err===null) {
        if (t!=null) {
          const {imageBase64, instant} = t; // corr-id: SSE-1585746250
          dispatch(getFeatPhotoSuccess(imageBase64, instant));
        } else {
          dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'photo appears to have been deleted', err)) );
        }
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      }}).catch(
        (err: any) => handleAxiosException(err, dispatch, f, url, actionCreator)
      );
  };
}
  



