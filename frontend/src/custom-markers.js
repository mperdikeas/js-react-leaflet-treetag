const L = require('leaflet');



const CustomCircleMarker = L.CircleMarker.extend({
    options: {
        id: null
   }
});

module.exports.CustomCircleMarker = CustomCircleMarker;
