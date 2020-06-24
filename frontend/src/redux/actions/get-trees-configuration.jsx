const React = require('react');

import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';

import { v4 as uuidv4 } from 'uuid';


import {displayModal
      , clearModal
      , addToast
    ,   updateConfiguration}
from './index.ts';
import {MDL_RETRY_CANCEL, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';
import {CANCEL_TOKEN_TYPES
      , cancelIncompatibleRequests
      , addCancelToken} from '../../util/axios-util.js';

import {cancelToken} from '../selectors.js';

import {urlForPhoto} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.jsx';

import {handleAxiosException} from './action-axios-exc-util.js';

export default function getTreesConfiguration() {
  const actionCreator = `getTreesConfiguration`;

  return (dispatch, getState) => {
    const f = ()=>dispatch(getTreesConfiguration());

    const uuid = uuidv4();
    const html = <span>please wait while tree configuration is fetched &hellip; </span>;
    console.log('cag - display modal for configuration');
    dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html, uuid}))


    const url = '/getConfiguration';

    // cf. SSE-1592901297    
    return axiosAuth.get(url).then(res => {
      dispatch(clearModal(uuid))
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
      }}).catch(err => {
        dispatch(clearModal(uuid));
        handleAxiosException(err, dispatch, f, url, actionCreator);
      }); // catch
  };
}




