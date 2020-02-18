const L = require('leaflet');



const CustomCircleMarker = L.CircleMarker.extend({
   options: { 
      someCustomProperty: 'Custom data!',
      anotherCustomProperty: 'More data!'
   }
});

module.exports.CustomCircleMarker = CustomCircleMarker;
