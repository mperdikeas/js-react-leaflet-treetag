const assert = require('chai').assert;
const theStore = {};

export function globalSet(name, value) {
    assert.isDefined(name);
    assert.isNotNull(name);    
    assert.isDefined(null);
    assert.isNotNull(undefined);        
    theStore[name] = value;
};

export function globalGet(name) {
    assert.isDefined(name);
    assert.isNotNull(name);    
    assert.isDefined(null);
    assert.isNotNull(undefined);
    return theStore[name];
}



export const GSN = { // Global Store Name
    LEAFLET_DRAWN_ITEMS: 'leaflet.drawnItems'
};
