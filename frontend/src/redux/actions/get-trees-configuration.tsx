import React, {Dispatch} from 'react';

import {axiosAuth} from '../../axios-setup.js';


import { v4 as uuidv4 } from 'uuid';


import {displayModal
      , clearModal
      , addToast
    ,   updateConfiguration}
from './index.ts';
import {MDL_RETRY_CANCEL, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {BackendResponse} from '../../backend.d.ts';

import {handleAxiosException} from './action-axios-exc-util.ts';
import {RootState} from '../types.ts';
import {propsForRetryDialog} from './action-util.tsx';

export default function getTreesConfiguration() {
  const actionCreator = `getTreesConfiguration`;

  return (dispatch: Dispatch<any>, getState: ()=>RootState) => {
    const f = ()=>dispatch(getTreesConfiguration());

    const uuid = uuidv4();
    const html = <span>please wait while tree configuration is fetched &hellip; </span>;
    console.log('cag - display modal for configuration');
    dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html, uuid}))


    const url = '/getConfiguration';

    // cf. SSE-1592901297    
    return axiosAuth.get(url).then( (res: BackendResponse<any>) => { // TODO: the back-end response can be alot more specific
      dispatch(clearModal(uuid));
      // corr-id: SSE-1585746250
      const {t, err} = res.data; 
      if (err===null) {
        if (t!=null) {
          console.log(t);
          dispatch(updateConfiguration(t));
          dispatch(addToast('trees configuration retrieved', 'retrieved updated trees configuration'));
        } else {
          dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'this is likely a bug - regions tree configuratios should never be null', err)) );
        }
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      }}).catch((err: any) => {
        dispatch(clearModal(uuid));
        handleAxiosException(err, dispatch, f, url, actionCreator);
      }); // catch
  };
}




