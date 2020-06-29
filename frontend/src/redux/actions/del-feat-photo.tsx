import {Dispatch} from 'react';

// @ts-expect-error
import CancelToken from '../../../node_modules/axios/lib/cancel/CancelToken.js';

import chai from '../../util/chai-util.js';
const assert = chai.assert;



//import {StandardAction} from './types.ts';

import {axiosAuth} from '../../axios-setup.js';


import {RootState} from '../types.ts';
import { v4 as uuidv4 } from 'uuid';

import {displayModal
      , clearModal
      , getFeatNumPhotos
      , addToast} from './index.ts';
import {MDL_RETRY_CANCEL
      , MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../util/axios-util.js';



import {urlForPhotoDeletion} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.tsx';

import {handleAxiosException} from './action-axios-exc-util.ts';

import {propsForRetryDialog} from './action-util.tsx';

import {BackendResponse} from '../../backend.d.ts';

export default function delFeatPhoto(id: number, idx: number) {
  const actionCreator = `delFeatPhoto(${id}, ${idx})`;
  assert.isTrue(idx>=0,`${actionCreator} idx value of [${idx}] is not GTE 0`);


  return (dispatch: Dispatch<any>, getState: ()=>RootState) => {
    const f = ()=>dispatch(delFeatPhoto(id, idx));
    cancelPendingRequests(getState());

    const url = urlForPhotoDeletion(id, idx);
    const html = `deleting photo ${idx+1} of feature ${id}`;
    const uuid = uuidv4();

    dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html, uuid}));

    axiosAuth.delete(url).then( (res: BackendResponse) => {
      dispatch(clearModal(uuid));

      const {t, err} = res.data;
      if (err != null) {
        assert.isNull(t);
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      } else {
        assert.isNotNull(t);
        dispatch(addToast('Successful deletion', `successfully deleted photo ${idx+1} of feature ${id}`));
        dispatch(getFeatNumPhotos(id));
      }
    }).catch( (err: any) => {
      dispatch(clearModal(uuid));
      // TODO: add option in handleAxiosException to tolerate OP_NO_LONGER_RELEVANT or not
      assert.isFalse( (err.message != null) && (err.message === OP_NO_LONGER_RELEVANT)
        , `${actionCreator} :: URL is ${url} impossible to encounter this as I dont ever cancel photo deletion requests`);
      handleAxiosException(err, dispatch, f, url, actionCreator)
    });
  };
}

