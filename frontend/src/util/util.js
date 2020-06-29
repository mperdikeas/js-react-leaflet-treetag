import chai from './chai-util.js';
const assert = chai.assert;


export function allStrictEqual(xs) {
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

export function exactlyOne(...theArgs) {
    const truthyCount = theArgs.reduce( (previous, current) => {
        return previous + (!!current);
    }, 0);
    return truthyCount == 1;
}

export function sca_fake_return() {
    return 'returning this just to satisfy Static Code Analysis';
}

export function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  console.log(`Cookie set as ${document.cookie}`);
}


export function readCookie(name, panicIfMoreThanOnce, panicIfNotFound) {
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

export function uniqValues(xs) {
    assert.isTrue(Array.isArray(xs));
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }

    return xs.filter( onlyUnique );
}

export function randomItem(items) {
    assert.isTrue(Array.isArray(items));    
    const rv = items[Math.floor(Math.random() * items.length)];
    return rv;
}

export function areEqualShallow(a, b) {
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

// TODO: use chai exists instead
export function isNotNullOrUndefined(v) {
    return (v!==undefined) && (v!==null);
}


export function tnu(x) { // Text representation for Null or Undefined
    if (x===null)
        return 'null';
    else if (x===undefined)
        return 'undefined';
    else {
        return 'cetera';
    }
}

// reports the elements in [bs] that do not appear in [as]
export function deepDiff(as, bs) {
    return bs.filter(x => !as.some(item => JSON.stringify(item)===JSON.stringify(x)));
}
