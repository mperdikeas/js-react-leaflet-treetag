const assert = require('chai').assert;
const theStore = {};

export function globalSet(name, value) {
    assert.isDefined(name);
    assert.isNotNull(name);    
    assert.isDefined(null);
    assert.isNotNull(undefined);        
    theStore[name] = value;
};

export function globalGet(name, expectFound=true) {
    assert.isDefined(name);
    assert.isNotNull(name);    
    assert.isDefined(null);
    assert.isNotNull(undefined);
    const rv = theStore[name];
    if (expectFound) {
        assert.isDefined(rv);
    }
    return rv;
}



export const GSN = { // Global Store Name
    LEAFLET_DRAWN_ITEMS: 'leaflet.drawnItems',
    LEAFLET_MAP: 'leaflet.map',
    LEAFLET_LAYERS_CONTROL: 'leaflet.layers.control',
    LEAFLET_QUERY_LAYER: 'leafet.query_layer',
    REACT_MAP: 'react.map' // this is the React map component, not the Leaflet map
};
