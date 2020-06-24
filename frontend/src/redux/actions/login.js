import chai from '../../util/chai-util';
const assert = chai.assert;

import { v4 as uuidv4 } from 'uuid';

import {storeAccessToken} from '../../access-token-util.js';
import {axiosPlain} from '../../axios-setup.js';
import {propsForRetryDialog} from './action-util.jsx';
import {MDL_RETRY_CANCEL, MDL_NOTIFICATION} from '../../constants/modal-types.js';

import {displayModal} from './index.ts';


export default function login({installation, username, password}, updateLogin, followUpFunc) {
    assert.isNotNull(followUpFunc);
    assert.isDefined(followUpFunc);
    assert.isTrue(typeof(followUpFunc)===typeof(()=>{}));
    console.log(`login:: followUpFunc is ${followUpFunc.name}`);
    console.log('login:: body of followUpFunc is:');
    console.log(followUpFunc);
    return (dispatch) => {
        const f = ()=>dispatch(login({installation, username, password}, updateLogin, followUpFunc));
        const actionCreator = `login({${installation}, ${username}, ${password}}, ...`;
        console.debug(actionCreator);
        const url = '/login';
        axiosPlain.post(url, {
            installation: installation,
            username: username,
            password: password
        }).then(res => {
            if (res.data.err != null) {
                console.error(`error at ${actionCreator}, url: [${url}]: `, res.data.err);
                console.error(JSON.stringify(res.data.err));
                dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, `unexpected error at login (case 1)`, res.data.err)) );
            } else {
                if (res.data.t.loginFailureReason===null) {
                    if ((new Date()).getMilliseconds() % 5 === 0)
                        throw 'shit happened in JS';
                    storeAccessToken(res.data.t.accessToken);
                    updateLogin(username);
                    console.log(`about to execute followUpFunc in login:`);
                    console.log(followUpFunc);
                    followUpFunc();
                } else {
                    console.error(`${actionCreator} was unsuccessful; failure reason was given as [${res.data.t.loginFailureReason}]`);
                    const html = `credentials of (${installation}, ${username}, ${password}) were incorrect (or some other server-side error occured)`;
                    dispatch(displayModal(MDL_NOTIFICATION, {html, uuid: uuidv4()}));
                    if (false) // TODO: I should be logging these messages on a message / activity tab
                        this.setState({logErrMsg: res.data.t.loginFailureReason});
                }
            }
        }).catch( err => {
            console.error(err);
            console.error(JSON.stringify(err));
            dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, `unexpected error at login (case 3)`, err)) );
        });
    };
}
