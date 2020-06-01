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
        }
        const url = '/getUser';
        axiosAuth.get(url).then(res => {
            console.error(res.data);
            if (res.data.err != null) {
                console.log('bac getUser API call error');
                assert.fail(res.data.err);
            } else {
                console.log('bac getUser API call success');
                console.log(res.data);
                const {installation, username} = res.data.t;
                updateLogin(username);
                // not sure what to do here ..
                // assert.fail('unhandled branch');
                history.replace(redirectTo);
            }
        }).catch( err => {
            console.log('bac getUser exception');
            console.log(err);
            console.log(JSON.stringify(err));
            dispatch(clearModal());
        });
    };
}
