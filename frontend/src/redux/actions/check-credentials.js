const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';


import {displayModal, clearModal } from './index.ts';
import {MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';
import { v4 as uuidv4 } from 'uuid';

export default function checkCredentials(redirectTo, history, updateLogin) {
    console.log(`checkCredentials(${JSON.stringify(redirectTo)}`);
    const uuid = uuidv4();
    return (dispatch) => {
        const accessToken = getAccessToken();
        if (accessToken == null) {
            /* the browser was likely closed or the local data were cleared - there's no point
             * in trying to get the user
             */
        } else {
            const msgCheckCred = 'παρακαλώ περιμένετε ενόσω το σύστημα ελέγχει τα διαπιστευτήριά σας';
            dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msgCheckCred, uuid}));
            const url = '/getUser';
            axiosAuth.get(url).then(res => {
                dispatch(clearModal(uuid));
                if (res.data.err != null) {
                    assert.fail(res.data.err);
                } else {
                    const {installation, username} = res.data.t;
                    updateLogin(username);
                    history.replace(redirectTo);
                }
            }).catch( err => {
                dispatch(clearModal(uuid));
                if (err.response.status != 403) {
                    // in case the JWT token has expired, the back-end code responds with 403
                    console.error(err);
                    assert.fail(`unexpected status: [${err.response.status}]`);
                }
            });
        }
    };
};

