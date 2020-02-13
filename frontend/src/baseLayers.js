require('./tile-stamen-v1_3_0.js');

const assert = require('chai').assert;

const L = require('leaflet');

const BaseLayers = {
    'esri': {friendlyName: 'ESRI'
             , tileLayer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
                detectRetina: true,
                maxZoom: 50
             })}
    ,'esri/satellite': {friendlyName: 'ESRI (sat)'
                        , tileLayer: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
	        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
                detectRetina: true,
                maxZoom: 50
             })}
    , 'mapbox': {friendlyName: 'MapBox'
                 , tileLayer: L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 25,
                id: 'mapbox/streets-v11',
                accessToken: "pk.eyJ1IjoibXBlcmRpa2VhcyIsImEiOiJjazZpMjZjMW4wOXJzM2ttc2hrcTJrNG9nIn0.naHhlYnc4czWUjX0-icY7Q"
                 })}
    , 'thunderforest/landscape': {friendlyName: 'Thunderforest (landscape)'
                                  , tileLayer: L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png')}
    , 'thunderforest/cycle': {friendlyName: 'Thunderforest (cycle)'
                                  , tileLayer: L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png')}
    , 'thunderforest/transport': {friendlyName: 'Thunderforest (transport)'
                                  , tileLayer: L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png')}
    , 'thunderforest/outdoors': {friendlyName: 'Thunderforest (outdoors)'
                                 , tileLayer: L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png')}
    , 'stamen/watercolor': {friendlyName: 'Stamen (watercolor)'
                            , tileLayer: new L.StamenTileLayer("watercolor")}
    , 'stamen/terrain': {friendlyName: 'Stamen (terrain)'
                         , tileLayer: new L.StamenTileLayer("terrain")}
    , 'stamen/toner': {friendlyName: 'Stamen (toner)'
                       , tileLayer: new L.StamenTileLayer("toner")}
};


const BaseLayersForLayerControl = (()=>{
    const rv = {};
    for (let x in BaseLayers) {
        rv[BaseLayers[x].friendlyName]=BaseLayers[x].tileLayer;
    }
    return rv;
})();

console.log('baselayers.js', JSON.stringify(BaseLayersForLayerControl));
module.exports = {BaseLayers, BaseLayersForLayerControl};


