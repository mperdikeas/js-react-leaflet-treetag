const assert = require('chai').assert;
import {storeAccessToken} from '../access-token-util.js';
import {axiosAuth} from '../axios-setup.js';

import {getAccessToken} from '../access-token-util.js';

import { clearModal } from './index.js';

export default function checkCredentials(redirectTo, history, updateLogin) {
    console.log(`bac inside checkCredentials(${JSON.stringify(redirectTo)}, ${JSON.stringify(history)})`);
    console.log(history);
    return (dispatch) => {
        const accessToken = getAccessToken();
        if (accessToken == null) {
            /* the browser was likely closed or the local data were cleared - there's no point
             * in trying to get the user
             */
            dispatch(clearModal());
        } else {
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
                if (err.response.status === 403) // in case the JWT token has expired, the back-end code responds with 403 
                    dispatch(clearModal());
                else {
                    console.log(err);
                    assert.fail(`unexpected status: [${err.response.status}]`);
                }
            });
        }
    };
}
