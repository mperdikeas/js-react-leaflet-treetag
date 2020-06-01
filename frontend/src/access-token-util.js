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
    assert.isDefined(accessToken, `access token [${ACCESS_TOKEN_KEY}] was read `
                     +`from the session storage as undefined. This is impossible `
                     +`given session storage contract`);
    assert.isNotNull(accessToken, `access token [${ACCESS_TOKEN_KEY}] was read `
                     +`from the session storage as null. This indicates a bug `
                     +`in my application`);
    return {
        Authorization: `Bearer ${accessToken}`
    };
}

exports.storeAccessToken = storeAccessToken;
exports.getAccessToken = getAccessToken;
exports.createAxiosAuthHeader = createAxiosAuthHeader;
