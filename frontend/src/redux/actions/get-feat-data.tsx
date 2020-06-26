import {Dispatch} from 'react';
import {axiosAuth} from '../../axios-setup.js';


// https://stackoverflow.com/q/62592351/274677
//import {CancelToken} from 'axios';
//import {CancelToken} from '../../../node_modules/axios/index.js';
import CancelToken from '../../../node_modules/axios/lib/cancel/CancelToken.js';

import {getTreeInfoInProgress
      , getFeatureAjaxConcluded
      , getTreeInfoSuccess
      , displayModal} from './index.ts';

import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {RootState} from '../types.ts';

import {BackendResponse} from '../../backend.d.ts';

import {urlForFeatData} from './feat-url-util.js';

import {cancelPendingRequests, propsForRetryDialog} from './action-util.jsx';

import {handleAxiosException} from './action-axios-exc-util.js';

export default function getFeatureData(id: number) {
  const actionCreator = `getFeatureData(${id})`;
  console.log(actionCreator);


  const source = CancelToken.source();
  return (dispatch: Dispatch<any>, getState: ()=>RootState) => {
    cancelPendingRequests(getState());
    const f = ()=>dispatch(getFeatureData(id));
    dispatch (getTreeInfoInProgress(id, source));
    const url = urlForFeatData(id);
    console.log(`${actionCreator} :: URL is: ${url}`);

    axiosAuth.get(url, {cancelToken: source.token}
    ).then( (res: BackendResponse) => {
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
      (err: any) => handleAxiosException(err, dispatch, f, url, actionCreator)
    ); // catch
  }; // return (dispatch) =>
} // fetchData
