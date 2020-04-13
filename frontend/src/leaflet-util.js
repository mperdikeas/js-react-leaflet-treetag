const assert = require('chai').assert;
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
/*
// https://stackoverflow.com/a/31813714/274677
export function isMarkerInsidePolygon(marker, poly) {
    const polyPoints = poly.getLatLngs();
    const x = marker.getLatLng().lat;
    const y = marker.getLatLng().lng;
    console.log(poly);
    let inside = false;
    for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
        var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
*/
export function isMarkerInsidePolygonsOfLayerGroup(marker, layerGroup) {
    const layers = layerGroup.getLayers();
    return layers.some( (layer) => {
        if (layer instanceof L.Polygon) {
            console.log(`layer is rectangle? ${layer instanceof L.Rectangle}`);
            const coords = [marker.getLatLng().lat, marker.getLatLng().lng];
            console.log(`polygon has ${layer.getLatLngs().length} nodes`);
            console.log(JSON.stringify(layer.getLatLngs()));
            const polyCoords = layer.getLatLngs()[0].map( (coord) => {
                return [coord.lat, coord.lng];
            } );
            const rv =  inside(coords, polyCoords);
            console.log(`${coords} inside ${JSON.stringify(polyCoords)} ? ${rv}`);
            return rv;
        } else
            return false;
    });
    return false;
};
