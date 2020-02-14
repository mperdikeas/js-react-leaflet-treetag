const     _ = require('lodash');
const assert = require('chai').assert;

const L = require('leaflet');



const DefaultIcon = L.Icon.extend({
    options: {
        iconUrl     : require('../node_modules/leaflet/dist/images/marker-icon.png'),
        shadowUrl   : require('../node_modules/leaflet/dist/images/marker-shadow.png'),
        iconSize    : [40, 60],
        shadowSize  : [60, 40],
        iconAnchor  : [20, 60],
        shadowAnchor: [20, 40],
        popupAnchor : [ 0, -60]
    }
});

const TreeIcon = L.Icon.extend({
    options: {
        iconUrl: require('./tree.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -2]
    }
});

exports.DefaultIcon = DefaultIcon;
exports.TreeIcon    = TreeIcon;

