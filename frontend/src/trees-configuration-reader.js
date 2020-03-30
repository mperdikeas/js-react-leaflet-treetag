const assert = require('chai').assert;
import axios from 'axios';

import {BASE_URL}                    from './constants.js';
import {sca_fake_return} from './util.js';

import {createAxiosAuthHeader} from './access-token-util.js';



export default function getTreesConfiguration() {
    const url = `${BASE_URL}/getTreesConfiguration`;
    return axios.get(url
//                     , {headers: createAxiosAuthHeader()}
                    ).then(res => {
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
                        console.log(err);
                        console.log(JSON.stringify(err));
                        assert.fail(err);
                    });
}

