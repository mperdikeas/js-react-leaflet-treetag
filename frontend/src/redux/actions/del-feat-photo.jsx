const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {displayModal
      , clearModal
      , getFeatNumPhotos} from './index.js';
import {MODAL_LOGIN, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {cancelToken} from '../selectors.js';

import {urlForPhotoDeletion} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.jsx';


export default function delFeatPhoto(id, idx) {
  assert.isTrue(idx>=0,`idx value of [${idx}] is not GTE 0`);

  /* don't generate a source as we won't ever cancel this
  * const source = CancelToken.source();
  */
  return (dispatch, getState) => {

    cancelPendingRequests(getState());



    const url = urlForPhotoDeletion(id, idx);

    const msg = (id, idx) => `deleting photo ${idx} of feature ${id}`;
    dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msg(id, idx)}));

    //dispatch (delFeatPhotoInProgress(id, idx));
    axiosAuth.delete(url /*, {cancelToken: source.token}*/).then(res => {
      console.log('bbb - 1');
      dispatch(clearModal());
      const {t, err} = res.data;
      console.log('bbb - 2');
      if (err===null) {
        console.log('bbb - 3');
        console.log(getFeatNumPhotos);
        dispatch(getFeatNumPhotos(id));
      } else {
        console.log('bbb - 4');
        console.error(err.strServerTrace);
        throw 'del-feat-photo-41';
      }
      console.log('bbb - 5');
    }).catch( err => {
      console.log(JSON.stringify(err));
      console.log(err);
      console.log(err.message);
      console.log(Object.keys(err));
      if (err.message === OP_NO_LONGER_RELEVANT) {
        console.error(`deleteFeatPhoto(${id}, ${idx}) is no longer relevant and got cancelled`);
        throw 'del-feat-photo-42-impossible to encounter this as I dont ever cancel photo deletion requests';
      } else if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case 'JWT-verif-failed':
            this.props.displayModalLogin( ()=>{dispatch(delFeatPhoto(id, idx))});
            break;
          default: {
            console.error(`deleteFeatPhoto(${id}, ${idx}) unexpected error!`);
            cosole.error(err.response.data);
            throw 'del-feat-photo-43-unhandled';
          }
        } // switch
      } else {
        console.error(err);
        console.error(JSON.stringify(err));
        throw 'del-feat-photo-44-unhandled';
      }
    });
  }; // return (dispatch)
} // deleteFeatPhoto

