const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';

import { v4 as uuidv4 } from 'uuid';


import {getRegionsInProgress
      , getRegionsSuccess
      , displayModal
      , clearModal
      , } from './index.js';
import {MDL_RETRY_CANCEL, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';
import {CANCEL_TOKEN_TYPES
      , cancelIncompatibleRequests
      , addCancelToken} from '../../util/axios-util.js';

import {cancelToken} from '../selectors.js';

import {urlForPhoto} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.jsx';

import {handleAxiosException} from './action-axios-exc-util.js';

export default function getRegions() {
  const actionCreator = `getRegions`;
  const TOKEN_TYPE = CANCEL_TOKEN_TYPES.GET_REGIONS;


  cancelIncompatibleRequests(TOKEN_TYPE);
  const source = CancelToken.source();
  addCancelToken(TOKEN_TYPE, source.token);
  return (dispatch, getState) => {
    const f = ()=>dispatch(getRegions());


    
    const uuid = uuidv4();
    const pleaseWaitWhileFetchingRegions = <span>please wait while regions are fetched &hellip; </span>;
    dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: pleaseWaitWhileFetchingRegions, uuid}))

    
    
    dispatch (getRegionsInProgress());
    const url = '/partitions';

    axiosAuth.get(url, {cancelToken: source.token}).then(res => {
      dispatch(clearModal(uuid))
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
      }}).catch(err => {
        dispatch(clearModal());
        handleAxiosException(err, dispatch, f, url, actionCreator);
      }); // catch
  };
}




