import { v4 as uuidv4 } from 'uuid';

import {Dispatch} from 'react';

import {MDL_NOTIFICATION} from '../../constants/modal-types.js';

import {displayModal, displayModalLogin} from './index.ts';
import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../util/axios-util.js';

import {propsForRetryDialog} from './action-util.tsx';

import {SERVER_ERROR_CODES} from './action-constants.ts';

import {StandardAction} from './types.ts';

import {isInsufficientPrivilleges} from '../../util-privilleges.js';

const displayNotificationInsufPrivilleges = (dispatch: Dispatch<StandardAction<{html: string, uuid:string}>>, uuid: string)=>{
    const html = 'the logged-in user has insufficient privilleges for this operation'; 
    dispatch(displayModal(MDL_NOTIFICATION, {html, uuid}));
};

export function handleAxiosException(err: any, dispatch: Dispatch<any>, f:()=>void, url: string, actionCreator: string) {
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
            dispatch( displayModalLogin(f) );
            break;
        }
        default: {
            console.error(err.response);
            console.error(err.response.data);
            console.error(`error code extracted as: ${code}`);
            console.error(`error msg extracted as: ${msg}`);
            console.error('details follow:', details);
            dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, `unrec code: ${code}`, err.response.data)) );
        }
        } // switch
    } else {
        console.error(err);
        dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'unrec err shape', err)));
    }
}
