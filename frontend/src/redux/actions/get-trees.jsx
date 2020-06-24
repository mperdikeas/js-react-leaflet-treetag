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
      , updateTrees} from './index.ts';
import {MDL_RETRY_CANCEL, MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';
import {CANCEL_TOKEN_TYPES
      , cancelIncompatibleRequests
      , addCancelToken} from '../../util/axios-util.js';

import {cancelToken} from '../selectors.js';

import {urlForPhoto} from './feat-url-util.js';

import {cancelPendingRequests} from './action-util.jsx';

import {handleAxiosException} from './action-axios-exc-util.js';

export default function getTrees(N) {
  const actionCreator = `getTrees(${N})`;

  return (dispatch, getState) => {
    const f = ()=>dispatch(getTrees(N));

    const uuid = uuidv4();
    const html = <span>fetching tree high-level data &hellip; </span>;
    console.log(`cag - display modal for fetching trees with uuid=${uuid}`);
    dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html, uuid}))


    /*
function getTrees(N) {
    const url = '/getTrees';
    return axiosAuth.get(url
                    ).then(res => {
                        if (res.data.err != null) {
                            console.log('getTrees API call error');
                            assert.fail(res.data.err);
                            return sca_fake_return();
                        } else {
                            console.log('getTrees API call success');
                            assert.isTrue(Array.isArray(res.data.t));
                            if (res.data.t.length < N) // TODO: I shouldn't have that on production
                                return res.data.t;
                            else
                                return res.data.t.slice(0, N);
                        }
                    }).catch( err => {
                        possiblyInsufPrivPanicInAnyCase(err);
                    });
}

    */

    const url = '/getTrees';

    /* SSE-1592901297
     * NB: it is critical that I return the promise as opposed to just executing
     *     otherwise, I won't be able to wait on it. See also:
     *
     *         https://github.com/reduxjs/redux/issues/723
     *  
     */
    return axiosAuth.get(url).then(res => {
      console.log(`cag - getTree success clearing modal ${uuid}`);
      dispatch(clearModal(uuid))
      // corr-id: SSE-1585746250
      const {t, err} = res.data; 
      if (err===null) {
        if (t!=null) {
          console.log(t);
          console.log('getTrees API call success');
          assert.isTrue(Array.isArray(res.data.t));
          const val = ((res)=>{
          if (res.data.t.length < N) // TODO: I shouldn't have that on production
            return res.data.t;
          else
            return res.data.t.slice(0, N);
            })(res);
          dispatch(updateTrees(val));
          dispatch(addToast('trees HLI fetched', 'high-level tree info refreshed'));
        } else {
          dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'this is likely a bug - trees should never be null (at most an empty array)', err)) );
        }
      } else {
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
    }}).catch(err => {
      console.error(err);
      console.log(`cag - getTree failure clearing modal ${uuid}`);
        dispatch(clearModal(uuid));
        handleAxiosException(err, dispatch, f, url, actionCreator);
      }); // catch
  };
}




