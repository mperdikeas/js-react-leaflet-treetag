const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {getRegionsInProgress
      , getRegionsSuccess
      , displayModal
      , } from './index.js';
import {MODAL_LOGIN
      , MDL_RETRY_CANCEL} from '../../constants/modal-types.js';
import {addCancelToken} from '../../globalStore';
import {CANCEL_TOKEN_TYPES} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';

import {urlForPhoto} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.jsx';

import {handleAxiosException} from './action-axios-exc-util.js';

export default function getRegions() {
  const actionCreator = `getRegions`;
  console.log(actionCreator);

  const f = ()=>getRegions();

  const source = CancelToken.source();
  addCancelToken(CANCEL_TOKEN_TYPES.GET_REGIONS, source.token);
  return (dispatch, getState) => {

//    cancelPendingRequests(getState());

    dispatch (getRegionsInProgress());
    const url = '/regions';
    console.log(`${actionCreator} :: URL is: ${url}`);

    axiosAuth.get(url, {cancelToken: source.token}).then(res => {
      // corr-id: SSE-1585746250
      const {t, err} = res.data; 
      if (err===null) {
        if (t!=null) {
          console.log(t);
          dispatch(getRegionsSuccess(t));
        } else {
          throw 42;
          dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'this is likely a bug - regions should never be null', err)) );
        }
      } else {
        throw 43;
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      }}).catch(
        err => handleAxiosException(err, dispatch, f, url, actionCreator)
      );
  };
}
  



