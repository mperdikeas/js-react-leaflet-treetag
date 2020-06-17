const assert = require('chai').assert;
const theStore = {};



export function globalSet(name, value) {
    assert.isDefined(name, 'name is undefined in globalSet');
    assert.isNotNull(name, 'name is null in globalSet');
    theStore[name] = value;
};

export function globalGet(name, expectFound=true) {
    assert.isDefined(name, 'name is undefined in globalGet');
    assert.isNotNull(name, 'name is null in globalGet');
    const rv = theStore[name];
    if (expectFound) {
        assert.isDefined(rv, `unable to find [${name}] in globalGet when expecting to find it`);
    }
    return rv;
}



export const GSN = { // Global Store Name
    REACT_MAP: 'react.map'                         // this is the React map component, not the Leaflet map
    , REACT_RGM_MAP: 'react.region.management.map' // -----------------
    , TARG_ADJ_PANE: 'target.adjustment.pane'
    , AXIOS_CANCEL_TOKENS: 'axios.cancel.tokens'
};

