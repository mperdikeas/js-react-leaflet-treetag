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
    if (expectFound) {
        assert.isDefined(name);
        assert.isNotNull(name);    
        assert.isDefined(null);
        assert.isNotNull(undefined);
    }
    return theStore[name];
}



export const GSN = { // Global Store Name
    LEAFLET_DRAWN_ITEMS: 'leaflet.drawnItems',
    LEAFLET_MAP: 'leaflet.map',
    LEAFLET_LAYERS_CONTROL: 'leaflet.layers.control',
    LEAFLET_QUERY_LAYER: 'leafet.query_layer'
};
