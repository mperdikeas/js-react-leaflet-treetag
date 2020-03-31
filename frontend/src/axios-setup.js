import axios from 'axios';
import {createAxiosAuthHeader} from './access-token-util.js';

const axiosPlain = axios.create();
const axiosAuth = axios.create();

axiosAuth.interceptors.request.use(config => {
    Object.assign(config.headers, createAxiosAuthHeader());
    return config;
}, error => {
    /* TODO: curiously the below code does not get executed even when shit happens
     *       e.g. when I manually clear the sessionStorage
     */
    return Promise.reject(`error: [${error}] while assigning auth header`
                          +` to axios request - this can only happen if`
                          +` the access token is not present in the session`
                          +` storage (e.g. maybe it was cleared manually?)`);
});

//export axiosPlain;// = axiosPlain;
//export axiosAuth;//  = axiosAuth;

export {axiosPlain, axiosAuth};
