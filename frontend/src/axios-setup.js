import axios from 'axios';
import {createAxiosAuthHeader} from './access-token-util.js';

const axiosPlain = axios.create();
const axiosAuth = axios.create();

axiosAuth.interceptors.request.use(config => {
    Object.assign(config.headers, createAxiosAuthHeader());
    return config;
}, error => {
    // handle the error
    return Promise.reject(error);
});

//export axiosPlain;// = axiosPlain;
//export axiosAuth;//  = axiosAuth;

export {axiosPlain, axiosAuth};
