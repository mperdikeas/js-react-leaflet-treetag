// TODO: I am quite confident that there's a lot of junk / unused imports here
import L from 'leaflet';
global.shp=require('shpjs');
require('./ots/leaflet.shpfile.js');


import proj4 from 'proj4';

const assert = require('chai').assert;

import { v4 as uuidv4 } from 'uuid';


import {DefaultIcon, TreeIcon}       from './icons.js';
import {CustomCircleMarker}          from './custom-markers.js';
import rainbow                       from './rainbow.js';
import {sca_fake_return
        , uniqValues}                from './util.js';
import {axiosAuth} from './axios-setup.js';


import getTreesConfiguration from './trees-configuration-reader.js';

const Athens = [37.98, 23.72];


const myRenderer = L.canvas({ padding: 0.5 });

const defaultMarkerStyle = ()=>{
    return {
        radius: 8
    };
};


function extractLayerNames(configuration) {
    return uniqValues(Object.values(configuration).map(x=>x.layer));
}

function from_kind2layer_to_layer2kinds(configuration) {
    const rv = {};
    const layers = extractLayerNames(configuration);
    for (let kind in configuration) {
        const layer = configuration[kind].layer;
        let kinds = rv[layer];
        if (kinds===undefined) {
            rv[layer] = [];
            kinds = rv[layer];
        }
        kinds.push(parseInt(kind));
    }
    return rv;
}

const treeOverlays = ()=> {
    return getTreesConfiguration().then( (treeConfiguration) => {
        console.log(treeConfiguration);
        const overlays = {};
        const overlayNames = extractLayerNames(treeConfiguration);
        console.log(overlayNames);
        const layer2kinds = from_kind2layer_to_layer2kinds(treeConfiguration);
        return getTrees(100).then( (data)=> {
            const targetId2Marker = {};
            overlayNames.forEach( (overlayName) => {
                const layerGroup = L.layerGroup(data.filter(({kind})=>{
                    const kindsInThisLayer = layer2kinds[overlayName];
                    assert.isTrue(Array.isArray(kindsInThisLayer));
                    const rv = kindsInThisLayer.includes(kind);
                    return rv;
                }).map( ({id, kind, coords})=> {
                    assert.isTrue(id != null);
                    let c = [coords.latitude, coords.longitude];
                    const color = treeConfiguration[kind].color;
                    const baseOptions = {targetId: id, color};

                    const useCanvasRenderer = true;
                    const styleOptions = (()=>{
                        if (useCanvasRenderer)
                            return Object.assign({}, defaultMarkerStyle(), {renderer: myRenderer});
                        else
                            return Object.assign({}, defaultMarkerStyle());
                    })();

                    const effectiveOptions = Object.assign({}, baseOptions, styleOptions);
                    /*
                     *  There is no need to use a custom class to add just one option; adding
                     *  the option on a vanila L.circleMarker works just as well.
                     *
                     *  const marker = new CustomCircleMarker(c, effectiveOptions);
                     */
                    const marker = new L.circleMarker(c, effectiveOptions);
                    targetId2Marker[id] = marker;
                    return marker;

                })); // const layerGroup = L.layerGroup(...
                overlays[overlayName] = layerGroup;
            }); // overlayNames.forEach
            return {targetId2Marker, overlays};
        });
    });
};



const ota_Callicrates = (()=>{
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
            return  {color:"black"};
        }
    };
    return L.shapefile(url, options);
})();


function getTrees(N) {
    const url = '/getTrees';
    return axiosAuth.get(url
//                     , {headers: createAxiosAuthHeader()}
                    ).then(res => {
                        if (res.data.err != null) {
                            console.log('getTrees API call error');
                            assert.fail(res.data.err);
                            return sca_fake_return();
                        } else {
                            console.log('getTrees API call success');
                            assert.isTrue(Array.isArray(res.data.t));
                            if (res.data.t.length < N)
                                return res.data.t;
                            else
                                return res.data.t.slice(0, N);
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


export {Athens, ota_Callicrates, treeOverlays, defaultMarkerStyle}
