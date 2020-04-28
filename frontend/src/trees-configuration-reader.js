const assert = require('chai').assert;


import {sca_fake_return} from './util.js';

import {axiosAuth} from './axios-setup.js';
import {possiblyInsufPrivPanicInAnyCase} from './util-privilleges.js';

export default function getTreesConfiguration() {
    const url = '/getConfiguration';
    return axiosAuth.get(url).then(res => {
        if (res.data.err != null) {
            console.log('getTreesConfiguration API call error');
            assert.fail(res.data.err);
            return sca_fake_return();
        } else {
            console.log('getTreesConfiguration API call success');
            console.log(res.data);
            return res.data.t;
        }
    }).catch( err => {
        throw err;
    });
}

