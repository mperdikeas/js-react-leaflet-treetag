const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {displayModal
      , clearModal
      , getFeatNumPhotos
      , addToast} from './index.js';
import {MODAL_LOGIN
      , MDL_RETRY_CANCEL
      , MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';

import {urlForPhotoDeletion} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.jsx';

import {handleAxiosException} from './action-axios-exc-util.js';

export default function delFeatPhoto(id, idx) {
  const actionCreator = `delFeatPhoto(${id}, ${idx})`;
  console.log(actionCreator);
  assert.isTrue(idx>=0,`${actionCreator} idx value of [${idx}] is not GTE 0`);
  const f = ()=>delFeatPhoto(id, idx);

  /* don't generate a source as we won't ever cancel this
  * const source = CancelToken.source();
  */
  return (dispatch, getState) => {

    cancelPendingRequests(getState());

    const url = urlForPhotoDeletion(id, idx);
    const msg = (id, idx) => `deleting photo ${idx+1} of feature ${id}`;
    dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msg(id, idx)}));

    axiosAuth.delete(url).then(res => {
      dispatch(clearModal());
      const {t, err} = res.data;
      if (err===null) {
        dispatch(addToast('Successful deletion', `successfully deleted photo ${idx+1} of feature ${id}`));
        dispatch(getFeatNumPhotos(id));
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
      }
    }).catch( err => {
      dispatch(clearModal());
      assert.isFalse( (err.message != null) && (err.message === OP_NO_LONGER_RELEVANT)
        , `${actionCreator} :: URL is ${url} impossible to encounter this as I dont ever cancel photo deletion requests`);
      handleAxiosException(err, dispatch, f, url, actionCreator)
    });
  };
}

