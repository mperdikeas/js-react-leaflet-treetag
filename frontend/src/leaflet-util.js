import chai from './util/chai-util';
const assert = chai.assert;

import {sca_fake_return} from './util/util.js';

import L from 'leaflet';

import inside from 'point-in-polygon';


export function numOfLayersInLayerGroup(layerGroup) {
    return layerGroup.getLayers().length;
}

export function layerIsEmpty(layerGroup) {
    return layerGroup.getLayers().length===0;
}

export function layerContainsAreas(layerGroup) {
    const layers = layerGroup.getLayers();
    return layers.some( (layer) => {
        return (layer instanceof L.Polygon);
    });
    return false;
}

export function theOneAndOnlyLayerInLayerGroup(layerGroup) {
    const n = numOfLayersInLayerGroup(layerGroup);
    assert.isStrictEqual(n, 1);
    return layerGroup.getLayers()[0];
}

export function isMarkerInsidePolygonsOfLayerGroup(marker, layerGroup) {
    const layers = layerGroup.getLayers();
    return layers.some( (layer) => {
        if (layer instanceof L.Polygon) {
            const coords = [marker.getLatLng().lat, marker.getLatLng().lng];
            const polyCoords = layer.getLatLngs()[0].map( (coord) => {
                return [coord.lat, coord.lng];
            } );
            const rv =  inside(coords, polyCoords);
            return rv;
        } else
            return false;
    });
    return false;
};


export function addPopup(marker, popup) {
    marker.bindPopup(`<span>${popup}</span>`);
    marker.on('mouseover', function(ev) {
        ev.target.openPopup();
    });
    marker.on('mouseout mouseleave', function(ev) {
        // in Chrome 80, the handler wouldn't fire with the mouseleave event
        ev.target.closePopup();
    });
}


export function getShapeType(layer) {

    if (layer instanceof L.Circle) {
        return 'circle';
    }

    if (layer instanceof L.Marker) {
        return 'marker';
    }

    if (layer instanceof L.Rectangle) {
        return 'rectangle';
    }

    if ((layer instanceof L.Polygon) && ! (layer instanceof L.Rectangle)) {
        return 'polygon';
    }

    if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
        return 'polyline';
    }

    assert.fail(`unrecognized layer type: ${layer.constructor.name}`);
    return sca_fake_return();
}


