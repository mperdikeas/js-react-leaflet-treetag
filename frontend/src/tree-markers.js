require('./ots/leaflet-heat.js');
window.shp=require('shpjs');
require('./ots/leaflet.shpfile.js');
require('@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css');
require('@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.js');

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';
import inside from 'point-in-polygon';
import keycode from 'keycode';
require('../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css');
require('../node_modules/leaflet.markercluster/dist/leaflet.markercluster.js');


const assert = require('chai').assert;

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import {DefaultIcon, TreeIcon} from './icons.js';
import {CustomCircleMarker}    from './custom-markers.js';
import rainbow                 from './rainbow.js';
import {BASE_URL}              from './constants.js';
import {sca_fake_return}       from './util.js';

const Athens = [37.98, 23.72];

const N = 10;

const myRenderer = L.canvas({ padding: 0.5 });

const defaultMarkerStyle = {
    color: '#3388ff',
    radius: 8
};

const targetId2Marker = {};

const USE_CLASSICAL_MARKERS = false;

const circleMarkersLG = ()=> {
    return L.layerGroup(getTrees(N*20).map( c0=> {
        c = [c0.latitude, c0.longitude];
        if (USE_CLASSICAL_MARKERS) {
            const options = {
                icon: new DefaultIcon()
                , renderer: myRenderer
                , clickable: true
                , draggable: false
                , title: 'a tree'
                , riseOnHover: true // rises on top of other markers
                , riseOffset: 250
            };
            const marker = L.marker(c, options).bindPopup('a fucking tree');
            return marker;
        } else {
            const useCanvasRenderer = true;
            const baseOptions = (()=>{
                if (useCanvasRenderer)
                    return Object.assign({}, defaultMarkerStyle, {renderer: myRenderer});
                else
                    return Object.assign({}, defaultMarkerStyle);
            })();

            const targetId = uuidv4();
            const newOptions = {targetId};
            const effectiveOptions = Object.assign({}, baseOptions, newOptions);
            /*
             *  There is no need to use a custom class to add just one option; adding
             *  the option on a vanila L.circleMarker works just as well.
             *
             *  const marker = new CustomCircleMarker(c, effectiveOptions);
             */
            const marker = new L.circleMarker(c, effectiveOptions);
            targetId2Marker[targetId] = marker;
            return marker;
        }
    }));
};

const circleMarkersDefaultLG = () => {
    return L.layerGroup(generateRandomCoordinatesInAthens(N*30).map( c=> {
        const options = {
            renderer: myRenderer,
            color: '#00ff00',
            radius: 8
        };
        return L.circleMarker(c, options);
    }));
};

const circlesLG = () => {
    return L.layerGroup(generateRandomCoordinatesInAthens(N).map( c=> {
        return L.circle(c, {
            renderer: myRenderer,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 8
        });
    }));
};


const treesLG = ()=>{
    return L.layerGroup(generateRandomCoordinatesInAthens(N).map( c=> {
        const options = {
            icon: new TreeIcon()
            , clickable: true
            , draggable: true
            , title: 'a tree'
            , riseOnHover: true // rises on top of other markers
            , riseOffset: 250
        };
        return L.marker(c, options).bindPopup('a fucking tree');
    }));
};

const defaultMarkersLG = ()=>{
    return L.layerGroup(generateRandomCoordinatesInAthens(N).map( c=> {
        const options = {
            icon: new DefaultIcon()
            , clickable: true
            , draggable: false
            , title: 'a tree'
            , riseOnHover: true // rises on top of other markers
            , riseOffset: 250
        };
        return L.marker(c, options).bindPopup('a fucking tree');
    }));
};

const makiMarkersLG = ()=>{
    return L.layerGroup(generateRandomCoordinatesInAthens(N).map( c=> {
        const options = {
            icon: new L.MakiMarkers.Icon({icon: randomItem(['park', 'park-alt1', 'wetland', 'florist'])
                                          , color: rainbow(30, Math.floor(Math.random()*30))
                                          , size: randomItem(['s', 'm', 'l'])})
            , clickable: false
            , draggable: false
            , title: 'a maki marker'
            , riseOnHover: true // rises on top of other markers
            , riseOffset: 250
        };
        return L.marker(c, options).bindPopup('a fucking tree');
    }));
};

const markerClusterGroup = ()=>{
    const rv = L.markerClusterGroup(
        {
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            spiderfyOnMaxZoom: true,
            removeOutsideVisibleBounds: true,
            maxClusterRadius: 80
        }
    );
    generateRandomCoordinatesInAthens(1*100).forEach( c=> {
        const options = {
            icon: new L.MakiMarkers.Icon({icon: randomItem(['park', 'park-alt1', 'wetland', 'florist'])
                                          , color: rainbow(30, Math.floor(Math.random()*30))
                                          , size: randomItem(['s', 'm', 'l'])})
            , clickable: false
            , draggable: false
            , title: 'a maki marker'
            , riseOnHover: true // rises on top of other markers
            , riseOffset: 250
        };
        rv.addLayer(L.marker(c, options).bindPopup('a fucking tree'));
    });
    return rv;
};



const heatMap = ()=>{

    const heatMapCfg = {
        minOpacity: 0.5
        , maxZoom: 19
        , max: 1
        , radius: 35 //  radius of each "point" of the heatmap, 25 by default
        , blur: 15   //amount of blur, 15 by default
        , gradient: {.4:"blue",.6:"cyan",.7:"lime",.8:"yellow",1:"red"} // color gradient config
    };
    return L.heatLayer(generateRandomCoordinatesInAthens(100)
                       , heatMapCfg);
};


const ota_Callicrates = ()=>{
    const url = require('../data/oriadhmwnkallikraths.zip');
    const options = {
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                layer.bindPopup(Object.keys(feature.properties).map(function(k) {
                    return k + ": " + feature.properties[k];
                }).join("<br />"), {
                    maxHeight: 200
                });
            }
        }
        , style: (feature)=>{
            return  {color:"black",fillColor:"red",fillOpacity:.75};
        }
    };
    return L.shapefile(url, options);

};


function getTrees(N) {
    const url = `${BASE_URL}/installation/1/getTrees`;
    const allCookies = document.cookie;
    console.log(`cookies read as ${allCookies}`);
    axios.get(url, {headers: {
        Cookie: allCookies
    }} ).then(res => {
        if (res.data.err != null) {
            console.log('getTrees API call error');
            assert.fail(res.data.err);
            return sca_fake_return();
        } else {
            console.log('getTrees API call success');
            console.log(res.data.t);
            return res.data.t;
        }
    }).catch( err => {
        console.log(err);
        console.log(JSON.stringify(err));
        assert.fail(err);
    });
}


function generateRandomCoordinatesInAthens(N) {
    const rv = [];
    const spanDegrees = 0.05;
    
    for (let i = 0; i < N; i++) {
        rv.push([Athens[0]+(Math.random()-.5)*spanDegrees
                 , Athens[1]+(Math.random()-.5)*spanDegrees]);
    }
    return rv;
}

function randomItem(items) {
    const rv = items[Math.floor(Math.random() * items.length)];
    return rv;
}

const layerGroupsPre = {circleMarkersLG:          {layer: circleMarkersLG       , available:  true, isInitiallyDisplayed: true}
                        , circleMarkersDefaultLG: {layer: circleMarkersDefaultLG, available:  true, isInitiallyDisplayed: false}
                        , circlesLG:              {layer: circlesLG             , available:  true, isInitiallyDisplayed: false}
                        , treesLG:                {layer: treesLG               , available:  true, isInitiallyDisplayed: false}
                        , defaultMarkersLG:       {layer: defaultMarkersLG      , available: false, isInitiallyDisplayed: null}
                        , makiMarkersLG:          {layer: makiMarkersLG         , available: false, isInitiallyDisplayed: null}
                        , markerClusterGroup:     {layer: markerClusterGroup    , available: false, isInitiallyDisplayed: null}
                        , heatMap:                {layer: heatMap               , available: false, isInitiallyDisplayed: null}
                        , 'Καλλικρατικοί δήμοι':  {layer: ota_Callicrates       , available: false, isInitiallyDisplayed: null}
                    };

const layerGroups = ((layerGroups)=>{
    const rv = {};
    for (const prop in layerGroups) {
        if (Object.prototype.hasOwnProperty.call(layerGroups, prop)) {
            if (layerGroups[prop].available) {
                rv[prop] = {isInitiallyDisplayed: layerGroups[prop].isInitiallyDisplayed
                            , layer: layerGroups[prop].layer};
                assert.isNotNull(layerGroups[prop].isInitiallyDisplayed);
            } else
                assert.isNull(layerGroups[prop].isInitiallyDisplayed);
        }
    }
    return rv;
})(layerGroupsPre);


//exports.Athens = Athens;
//exports.layerGroups = layerGroups;

// export Athens
// export layerGroups

export {Athens, layerGroups, defaultMarkerStyle, targetId2Marker, USE_CLASSICAL_MARKERS}


// const layerGroups = [{layer: circleMarkersLG

// export {circleMarkersLG, circlesLG, treesLG, defaultMarkersLG, makiMarkersLG, markerClusterGroup}

