const assert = require('chai').assert;

const ACCESS_TOKEN_KEY = 'access_token';

function storeAccessToken(accessToken) {
    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function getAccessToken() {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

function createAxiosAuthHeader() {
    const accessToken = getAccessToken();
    return {
        Authorization: `Bearer ${accessToken}`
    };
}

exports.storeAccessToken = storeAccessToken;
exports.createAxiosAuthHeader = createAxiosAuthHeader;
