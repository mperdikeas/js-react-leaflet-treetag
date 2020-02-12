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
import 'leaflet/dist/leaflet.css';


class Map extends React.Component {

    constructor(props) {
        super(props);
        this.esriTileLayer = 
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
                detectRetina: true,
                maxZoom: 50
            });
        {
            const mapboxAccessToken = "pk.eyJ1IjoibXBlcmRpa2VhcyIsImEiOiJjazZpMjZjMW4wOXJzM2ttc2hrcTJrNG9nIn0.naHhlYnc4czWUjX0-icY7Q";
            this.mapboxTileLayer =
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 25,
                id: 'mapbox/streets-v11',
                accessToken: mapboxAccessToken
            });
        }
        this.currentTileLayer = null;
    }

    componentDidMount() {
        this.map = L.map('map-id', {
            center: Athens,
            zoom: 12,
            zoomControl: false
        });
        this.addTiles(null);
        this.addMarkers();
    }

    componentDidUpdate(newProps, newState) {
        console.log('Map::componentDidUpdate');
        if (newProps.tileProviderId!==this.props.tileProviderId) {
            console.log(`tile provider change detected from ${this.props.tileProviderId} to ${newProps.tileProviderId}`);
            this.addTiles();
        }
    }

    addTiles() {
        if (this.currentTileLayer!==null) {
            console.log('removing previous tile provider from map');
            this.map.removeLayer(this.currentTileLayer);
        }
        const {tileProviderId} = this.props;
        if (tileProviderId===1) {
            this.esriTileLayer.addTo(this.map);
            this.currentTileLayer = this.esriTileLayer;
        } else if (tileProviderId===2) {
            this.mapboxTileLayer.addTo(this.map);
            this.currentTileLayer = this.mapboxTileLayer;
        } else
            assert.fail(`unhandled case ${tileProviderId}`);
    }
    
    addMarkers() {
        const treeIcon = new L.icon({
            iconUrl: require('./tree.png'),
            iconSize: [16, 16],
            iconAnchor: [4, 4],
            popupAnchor: [0, -2]
        });

        /*
         *  circle markers
         *
         */
        var myRenderer = L.canvas({ padding: 0.5 });
        generateCoordinatesInAthens(100).forEach( c=> {
            var circleMarker = L.circleMarker(c, {
                renderer: myRenderer,
                color: '#3388ff',
                radius: 3
            }).addTo(this.map);
        });

        /*
         *  circles
         *
         */

        generateCoordinatesInAthens(10*1000).forEach( c=> {
            L.circle(c, {
                renderer: myRenderer,
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 1
            }).addTo(this.map);
        });

        /*
         *  markers
         *
         */            
        generateCoordinatesInAthens(100).forEach( c=> {
            L.marker(c, {icon: treeIcon}).addTo(this.map).bindPopup('a fucking tree');
        });



        

    }
    

    render() {
        console.log('render()');
        return (
                <div id='map-id' style={{width: "80%", height: "800px" }}>
                </div>
        );
    }
}

const Athens = [37.98, 23.72];

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

