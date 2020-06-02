const assert = require('chai').assert;
function theAnswer() {
    const rv = (()=>{
        return 42;
    })();
    return rv;
}

function allStrictEqual(xs) {
    assert.isTrue(Array.isArray(xs));
    if (xs.length <= 1)
        return true;
    else {
        const n = xs.length;
        for (let i = 1; i < n ; i++) {
            if (xs[i]!==xs[0])
                return false;
        }
        return true;
    }
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

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  console.log(`Cookie set as ${document.cookie}`);
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

function uniqValues(xs) {
    assert.isTrue(Array.isArray(xs));
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }

    return xs.filter( onlyUnique );
}

function randomItem(items) {
    assert.isTrue(Array.isArray(items));    
    const rv = items[Math.floor(Math.random() * items.length)];
    return rv;
}

function areEqualShallow(a, b) {
    for(let key in a) {
        if(!(key in b) || a[key] !== b[key]) {
            return false;
        }
    }
    for(let key in b) {
        if(!(key in a) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}


exports.theAnswer         = theAnswer;
exports.allStrictEqual    = allStrictEqual;
exports.exactlyOne        = exactlyOne;
exports.sca_fake_return   = sca_fake_return;
exports.setCookie         = setCookie;
exports.readCookie        = readCookie;
exports.uniqValues        = uniqValues;
exports.randomItem        = randomItem;
exports.areEqualShallow   = areEqualShallow;
