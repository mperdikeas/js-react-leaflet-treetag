require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;

import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // TODO: remove that
import proj4 from 'proj4';



import {BaseLayers, BaseLayersForLayerControl} from './baseLayers.js';

// https://spatialreference.org/ref/epsg/2100/
proj4.defs([
  [
    'EPSG:2100',
    '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs']
]);
const WGS84  = 'EPSG:4326';
const HGRS87 = 'EPSG:2100';

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.currentTileLayer = null;
    }

    componentDidMount() {
        this.map = L.map('map-id', {
            center: Athens,
            zoom: 12,
            zoomControl: false
        });
        this.addTiles(null);
        this.createLayerGroups();
        this.configureLayerGroups();
        this.map.on('click', function(e){
            const {lat, lng} = e.latlng;
            console.log(`You clicked the map at latitude: ${lat} and longitude ${lng}`);
            const proj = proj4(WGS84, HGRS87,[lng, lat]);
            console.log(`converted are ${proj}`);
        });
        L.control.layers(BaseLayersForLayerControl, this.layerGroups).addTo(this.map);

        this.map.on('zoomend', () => {
            this.configureLayerGroups();
            if (false)
            if (this.map.getZoom() < 15){
                this.map.removeLayer(this.layerGroups.circlesLG);
            }
            else {
                this.map.addLayer(this.layerGroups.circlesLG);
            }
        });
        $('div.leaflet-control-container section.leaflet-control-layers-list div.leaflet-control-layers-overlays input.leaflet-control-layers-selector[type="checkbox"]').on('change', (e)=>{
            console.log('checkbox changed', e);
        });

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tileProviderId!==this.props.tileProviderId) {
            console.log(`tile provider change detected from ${prevProps.tileProviderId} to ${this.props.tileProviderId}`);
            this.addTiles();
        }
    }

    addTiles() {
        if (this.currentTileLayer!==null) {
            console.log('removing previous tile provider from map');
            this.map.removeLayer(this.currentTileLayer);
        }
        const {tileProviderId} = this.props;
        console.log(`providerid is ${tileProviderId}`);
        const newBaseLayer = BaseLayers[tileProviderId].tileLayer;
        assert.isDefined(newBaseLayer);
        newBaseLayer.addTo(this.map);
        this.currentTileLayer = newBaseLayer;
    }
    
    createLayerGroups() {
        const treeIcon = new L.icon({
            iconUrl: require('./tree.png'),
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -2]
        });

        const myRenderer = L.canvas({ padding: 0.5 });

        const circleMarkersLG = L.layerGroup(generateCoordinatesInAthens(100).map( c=> {
            return L.circleMarker(c, {
                renderer: myRenderer,
                color: '#3388ff',
                radius: 8
            });
        }));

        const circlesLG = L.layerGroup(generateCoordinatesInAthens(10*1000).map( c=> {
            return L.circle(c, {
                renderer: myRenderer,
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 8
            });
        }));


        const treesLG = L.layerGroup(generateCoordinatesInAthens(100).map( c=> {

            const options = {
                icon: treeIcon // there is apparently an issue if I rely on the default icon
                , clickable: true
                , draggable: true
                , title: 'a tree'
                , riseOnHover: true // rises on top of other markers
                , riseOffset: 250
            };
            return L.marker(c, options).bindPopup('a fucking tree');
        }));

        this.layerGroups = {circleMarkersLG, circlesLG, treesLG};
    }

    configureLayerGroups() {
        const zoomLevel = this.map.getZoom();
        for (let x in this.layerGroups) {
            if (zoomLevel >= LayersConfiguration[x].minZoomLevel)
                this.layerGroups[x].addTo(this.map);
            else
                this.map.removeLayer(this.layerGroups[x]);
        }
    }
    

    render() {
        console.log('Map::render()');
        return (
                <div id='map-id' style={{width: "80%", height: "800px" }}>
                </div>
        );
    }
}

const Athens = [37.98, 23.72];

class LayerConfiguration {
    constructor(minZoomLevel) {
        this.minZoomLevel = minZoomLevel;
    }
}

const LayersConfiguration = {
    circleMarkersLG: new LayerConfiguration(14),
    circlesLG      : new LayerConfiguration(17),
    treesLG        : new LayerConfiguration(13)
};

function generateCoordinatesInAthens(N) {
    const rv = [];
    const spanDegrees = 0.05;
    
    for (let i = 0; i < N; i++) {
        rv.push([Athens[0]+(Math.random()-.5)*spanDegrees
                 , Athens[1]+(Math.random()-.5)*spanDegrees]);
    }
    return rv;
}

export default Map;

