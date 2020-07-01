import React, {Dispatch} from 'react';
const {CancelToken} = require('axios');

import chai from '../../util/chai-util.js'
//@ts-expect-error
const assert = chai.assert;

import {axiosAuth} from '../../axios-setup.js';

import { v4 as uuidv4 } from 'uuid';

import {getRegionsInProgress
      , getRegionsSuccess
      , displayModal
      , clearModal
      , addToast
      , } from './index.ts';
import {MDL_RETRY_CANCEL, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';
import {CANCEL_TOKEN_TYPES
      , cancelIncompatibleRequests
      , addCancelToken} from '../../util/axios-util.js';

import {handleAxiosException} from './action-axios-exc-util.ts';
import {propsForRetryDialog} from './action-util.tsx';

import {BackendResponse, PartitionsForInstallation} from '../../backend.d.ts';

export default function getRegions(toastOnSuccess=false) {
  const actionCreator = `getRegions`;
  const TOKEN_TYPE = CANCEL_TOKEN_TYPES.GET_REGIONS;

  cancelIncompatibleRequests(TOKEN_TYPE);
  const source = CancelToken.source();
  addCancelToken(TOKEN_TYPE, source.token);
  return (dispatch: Dispatch<any>) => {
    const f = ()=>dispatch(getRegions());


    
    const uuid = uuidv4();
    const pleaseWaitWhileFetchingRegions = <span>please wait while regions are fetched &hellip; </span>;
    dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: pleaseWaitWhileFetchingRegions, uuid}))

    
    
    dispatch (getRegionsInProgress());
    const url = '/partitions';

    axiosAuth.get(url, {cancelToken: source.token}).then((res: BackendResponse<PartitionsForInstallation>) => {
      dispatch(clearModal(uuid))
      // corr-id: SSE-1585746250
      const {t, err} = res.data; 
      if (err===null) {
        if (t!=null) {
          console.log(t);
          dispatch(getRegionsSuccess(t));
          toastOnSuccess && dispatch(addToast('regions retrieved', 'an updated set of partitions and regions has been retrieved'));
        } else {
          dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'this is likely a bug - regions should never be null', err)) );
        }
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      }}).catch((err:any) => {
        dispatch(clearModal(uuid));
        handleAxiosException(err, dispatch, f, url, actionCreator);
      }); // catch
  };
}




