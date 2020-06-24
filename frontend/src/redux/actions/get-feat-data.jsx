const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {getTreeInfoInProgress
      , getFeatureAjaxConcluded
      , getTreeInfoSuccess
      , displayModal
      , clearModal} from './index.ts';
import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {cancelToken} from '../selectors.js';

import {urlForFeatData} from './feat-url-util.js';

import {cancelPendingRequests, propsForRetryDialog} from './action-util.jsx';

import {handleAxiosException} from './action-axios-exc-util.js';

export default function getFeatureData(id) {
  const actionCreator = `getFeatureData(${id})`;
  console.log(actionCreator);


  const source = CancelToken.source();
  return (dispatch, getState) => {
    cancelPendingRequests(getState());
    const f = ()=>dispatch(getFeatureData(id));
    dispatch (getTreeInfoInProgress(id, source));
    const url = urlForFeatData(id);
    console.log(`${actionCreator} :: URL is: ${url}`);

    axiosAuth.get(url, {cancelToken: source.token}
    ).then(res => {
      dispatch(getFeatureAjaxConcluded());
      // corr-id: SSE-1585746250
      const {t, err} = res.data;
      if (err != null) {
        console.error(`${actionCreator} :: error at URL [${url}]`);
        console.error(res.data.err);
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      } else {
        dispatch( getTreeInfoSuccess(t) );
      }
    }).catch(
      err => handleAxiosException(err, dispatch, f, url, actionCreator)
    ); // catch
  }; // return (dispatch) =>
} // fetchData
