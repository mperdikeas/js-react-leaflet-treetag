import axios from 'axios';
import {createAxiosAuthHeader} from './access-token-util.js';

axios.interceptors.request.use(config => {
    // perform a task before the request is sent
    Object.assign(config.headers, createAxiosAuthHeader());
    //    config.headers = Object.assign({}, config['X-CodePen'] = 'https://codepen.io/teroauralinna/full/vPvKWe';
    return config;
}, error => {
    // handle the error
    return Promise.reject(error);
});
