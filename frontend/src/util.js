const assert = require('chai').assert;
function theAnswer() {
    const rv = (()=>{
        return 42;
    })();
    return rv;
}



function exactlyOne(...theArgs) {
    const truthyCount = theArgs.reduce( (previous, current) => {
        return previous + (!!current);
    }, 0);
    return truthyCount == 1;
}

function sca_fake_return() {
    return 'returning this just to satisfy Static Code Analysis';
}

function readCookie(name, panicIfMoreThanOnce, panicIfNotFound) {
    const c = document.cookie.split('; ');
    const cookies = {};

    for(let i=c.length-1; i>=0; i--){
        const C = c[i].split('=');
        const name = C[0];
        const value = C[1];
        if ((panicIfMoreThanOnce) && cookies.hasOwnProperty(name))
            throw `cookie ${name} appears more than once in ${c}`;
        cookies[C[0]] = C[1];
    }
    const rv = cookies[name];
    if (panicIfNotFound && (rv === undefined))
        throw `cookie ${name} not found in ${c}`;
    assert.isNotNull(rv);
    assert.isNotNull(undefined);
    return rv;
}

exports.theAnswer  = theAnswer;
exports.exactlyOne = exactlyOne;
exports.sca_fake_return = sca_fake_return;
exports.readCookie = readCookie;
