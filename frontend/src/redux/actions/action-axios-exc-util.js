const assert = require('chai').assert;

import { v4 as uuidv4 } from 'uuid';

import {displayModal} from './index.js';
import {MODAL_LOGIN, MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {urlForFeatData} from './feat-url-util.js';

import {propsForRetryDialog} from './action-util.jsx';

import {SERVER_ERROR_CODES} from './action-constants.js';



import {isInsufficientPrivilleges} from '../../util-privilleges.js';

const displayNotificationInsufPrivilleges = (dispatch, uuid)=>{
    const msgInsufPrivl = 'the logged-in user has insufficient privilleges for this operation'; 
    dispatch(displayModal(MDL_NOTIFICATION, {html: msgInsufPrivl, uuid}));
};

export function handleAxiosException(err, dispatch, f, url, actionCreator) {
    if (isInsufficientPrivilleges(err)) {
        console.warn(`${actionCreator} at url: [${url}] ~*~ insuf priv detected`);
        displayNotificationInsufPrivilleges(dispatch, uuidv4());
    } else if (err.message === OP_NO_LONGER_RELEVANT) {
        console.log(`${actionCreator} operation at ${url} is no longer relevant and got cancelled`);
    } else if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
        case SERVER_ERROR_CODES.JWT_VERIF_FAILED: {
            dispatch( displayModal(MODAL_LOGIN, {uuid: uuidv4()
                                                 , followUpFunction: ()=>{dispatch(f());}}) );
            break;
        }
        default: {
            console.error(err.response);
            console.error(err.response.data);
            dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, `unrec code: ${code}`, err.response.data)) );
        }
        } // switch
    } else {
        console.error(err);
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'unrec err shape', err)));
    }
}
