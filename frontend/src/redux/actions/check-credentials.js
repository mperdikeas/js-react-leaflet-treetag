const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';


import {displayModal, clearModal } from './index.js';
import {MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

export default function checkCredentials(redirectTo, history, updateLogin) {
    console.log(`checkCredentials(${JSON.stringify(redirectTo)}`);
    return (dispatch) => {
        const accessToken = getAccessToken();
        if (accessToken == null) {
            /* the browser was likely closed or the local data were cleared - there's no point
             * in trying to get the user
             */
        } else {
            const msgCheckCred = 'παρακαλώ περιμένετε ενόσω το σύστημα ελέγχει τα διαπιστευτήριά σας';
            dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msgCheckCred}));
            const url = '/getUser';
            axiosAuth.get(url).then(res => {
                dispatch(clearModal());
                if (res.data.err != null) {
                    assert.fail(res.data.err);
                } else {
                    const {installation, username} = res.data.t;
                    updateLogin(username);
                    history.replace(redirectTo);
                }
            }).catch( err => {
                dispatch(clearModal());
                if (err.response.status != 403) {
                    // in case the JWT token has expired, the back-end code responds with 403
                    console.error(err);
                    assert.fail(`unexpected status: [${err.response.status}]`);
                }
            });
        }
    };
};

