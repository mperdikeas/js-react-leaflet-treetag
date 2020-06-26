const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {getFeatPhotoInProgress
      , getFeatPhotoSuccess
      , getFeatureAjaxConcluded
      , displayModal
      , clearModal} from './index.ts';
import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {cancelToken} from '../selectors.ts';

import {urlForPhoto} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.jsx';

import {handleAxiosException} from './action-axios-exc-util.js';
import {propsForRetryDialog} from './action-util.jsx';

export default function getFeatPhoto(id, idx) {
  const actionCreator = `getFeatPhoto(${id}, ${idx})`;
  console.log(actionCreator);
  assert.isTrue(idx>=0,`${actionCreator} idx value of [${idx}] is not GTE 0`);


  const source = CancelToken.source();
  return (dispatch, getState) => {

    cancelPendingRequests(getState());
    const f = ()=>dispatch(getFeatPhoto(id, idx));
    dispatch (getFeatPhotoInProgress(id, idx, source));
    const url = urlForPhoto(id, idx);
    console.log(`${actionCreator} :: URL is: ${url}`);

    axiosAuth.get(url, {cancelToken: source.token}).then(res => {
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
        err => handleAxiosException(err, dispatch, f, url, actionCreator)
      );
  };
}
  



