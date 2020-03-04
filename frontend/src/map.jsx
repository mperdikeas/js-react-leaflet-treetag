require('./css/style.css');
require('./ots/leaflet-heat.js');

require('@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css');
require('@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.js');



window.shp=require('shpjs');
require('./ots/leaflet.shpfile.js');


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
import proj4 from 'proj4';

require('../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css');
require('../node_modules/leaflet.markercluster/dist/leaflet.markercluster.js');

import {BaseLayers, BaseLayersForLayerControl} from './baseLayers.js';
import {DefaultIcon, TreeIcon}          from './icons.js';
import rainbow from './rainbow.js';

import {CustomCircleMarker} from './custom-markers.js';
import {GeometryContext} from './context/geometry-context.jsx';
// const Buffer = require('buffer').Buffer;
// const Iconv  = require('iconv').Iconv;


import {SELECT_TOOL, DEFINE_POLYGON_TOOL, MOVE_VERTEX_TOOL, REMOVE_TOOL} from './map-tools.js';


// https://spatialreference.org/ref/epsg/2100/
proj4.defs([
  [
    'EPSG:2100',
    '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs']
]);
const WGS84  = 'EPSG:4326';
const HGRS87 = 'EPSG:2100';

export default class Map extends React.Component {

  static contextType = GeometryContext
  
  constructor(props) {
    console.log('Map::constructor is called');
    super(props);
    this.state = {
      points: []
      };
  }

  getMapHeight = () => {
    console.log('Map::getMapHeight():: context is: ', this.context)
    return this.context.screen.height - this.context.geometry.headerBarHeight
  }

  getCurrentTileLayer = () => {
    const layers = [];
    this.map.eachLayer(function(layer) {
      if( layer instanceof L.TileLayer )
        layers.push(layer);
    });
    assert.isAtMost(layers.length, 1, `this code was written assumming that at most 1 tile layers are present, yet ${layers.length} were found`);
    if (layers.length===1)
      return layers[0];
    else
      return null;
  }

  drawPolygon = () => {
    console.log('drawpolygon', this.props.selectedTool, this.state.points);
    if (this.props.selectedTool===DEFINE_POLYGON_TOOL) {
      if (this.currentPolygon!=null)
        this.currentPolygon.setLatLngs(this.state.points);
      else
        this.currentPolygon = L.polygon(this.state.points).addTo(this.map);
    }
    if (false) {
      if (this.currentPolygon!=null)
        this.map.removeLayer(this.currentPolygon);
      if ((this.props.selectedTool===DEFINE_POLYGON_TOOL) && (this.state.points.length!==0)) {
        console.log('adding polygon to map');
        this.currentPolygon = L.polygon(this.state.points).addTo(this.map);
      }
    }
  }



  componentDidUnmount = () => {
    console.log('map::componentDidUnmount()');
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidMount = () => {
    console.log('map::componentDidMount()');
    window.addEventListener('resize', this.handleResize);
    this.map = L.map('map-id', {
      center: Athens,
      zoom: 12,
      zoomControl: false
    });
    this.addTiles();
    this.createLayerGroups();
    this.configureLayerGroups();
    if (false)
      this.map.on('mousemove', (e) => {
        this.props.updateCoordinates(e.latlng);
      })
    this.map.on('click', (e)=>{
      const {lat, lng} = e.latlng;
      this.setState({points: [...this.state.points, {lat, lng}]});
      this.drawPolygon();
      console.log(`You clicked the map at latitude: ${lat} and longitude ${lng}`);
      console.log('points are: ', this.state.points);
      this.props.updateCoordinates(e.latlng);
      const proj = proj4(WGS84, HGRS87,[lng, lat]);
      console.log(`converted are ${proj}`);
      const pulsingIcon = L.icon.pulse(
        {iconSize:[20,20]
       , color:'red'
       , animate: true
       , heartbeat: 0.4
        });
      const marker = L.marker([lat, lng],{icon: pulsingIcon}).addTo(this.map);
      marker.addTo(this.map);
      window.setTimeout(()=>{
        this.map.removeLayer(marker);
      }, 2000);
    });
    L.control.layers(BaseLayersForLayerControl, this.layerGroups).addTo(this.map);

    const recomputeLayerGroupsUponZoom = false;
    if (recomputeLayerGroupsUponZoom) {
      this.map.on('zoomend', () => {
        this.configureLayerGroups();
        if (this.map.getZoom() < 15){
          this.map.removeLayer(this.layerGroups.circlesLG);
        }
        else {
          this.map.addLayer(this.layerGroups.circlesLG);
        }
      });
    }
    $('div.leaflet-control-container section.leaflet-control-layers-list div.leaflet-control-layers-overlays input.leaflet-control-layers-selector[type="checkbox"]').on('change', (e)=>{
      console.log('checkbox changed', e);
    });

    
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tileProviderId!==this.props.tileProviderId) {
      console.log(`tile provider change detected from ${prevProps.tileProviderId} to ${this.props.tileProviderId}`);
      this.addTiles();
    }
  }

  addTiles() {
    const currentTileLayer = this.getCurrentTileLayer();
    if (currentTileLayer!==null) {
      console.log('removing previous tile provider from map');
      this.map.removeLayer(currentTileLayer);
    }
    const {tileProviderId} = this.props;
    console.log(`map::addTiles(): providerId is ${tileProviderId}`);
    const newBaseLayer = BaseLayers[tileProviderId].tileLayer;
    console.log('adding new base layer', newBaseLayer);
    assert.isDefined(newBaseLayer);
    newBaseLayer.addTo(this.map);
  }
  
  createLayerGroups() {
    const N = 10;

    const myRenderer = L.canvas({ padding: 0.5 });

    const circleMarkersLG = L.layerGroup(generateCoordinatesInAthens(N*1000).map( c=> {
      const baseOptions = {
        renderer: myRenderer,
        color: '#3388ff',
        radius: 8
      };
      const newOptions = {
        targetId: `${Math.random()}`
      };
      const effectiveOptions = Object.assign({}, baseOptions, newOptions);
      const useCustomMarker = true;
      if (useCustomMarker) {
        const marker = new CustomCircleMarker(c, effectiveOptions);
        marker.on('click', this.clickOnCircleMarker);
        return marker;
      } else {
        return L.circleMarker(c, baseOptions).on('click', this.clickOnCircleMarker);
      }
    }));

    const circlesLG = L.layerGroup(generateCoordinatesInAthens(N).map( c=> {
      return L.circle(c, {
        renderer: myRenderer,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 8
      });
    }));


    const treesLG = L.layerGroup(generateCoordinatesInAthens(N).map( c=> {
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

    const defaultMarkersLG = L.layerGroup(generateCoordinatesInAthens(N).map( c=> {
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

    const makiMarkersLG = L.layerGroup(generateCoordinatesInAthens(N).map( c=> {
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


    const markerClusterGroup = (()=>{
      const rv = L.markerClusterGroup(
        {
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true,
          spiderfyOnMaxZoom: true,
          removeOutsideVisibleBounds: true,
          maxClusterRadius: 80
        }
      );
      generateCoordinatesInAthens(1*100).forEach( c=> {
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
    })();


    const heatMap = (()=> {
      const heatMapCfg = {
        minOpacity: 0.5
        , maxZoom: 19
        , max: 1
        , radius: 35 //  radius of each "point" of the heatmap, 25 by default
        , blur: 15   //amount of blur, 15 by default
        , gradient: {.4:"blue",.6:"cyan",.7:"lime",.8:"yellow",1:"red"} // color gradient config
      };
      return L.heatLayer(generateCoordinatesInAthens(100)
                       , heatMapCfg);
    })();

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
    const ota_Callicrates = L.shapefile(url, options);

    this.layerGroups = {circleMarkersLG: circleMarkersLG
                      , circlesLG: circlesLG
                      , treesLG: treesLG
                      , defaultMarkersLG: defaultMarkersLG
                      , makiMarkersLG: makiMarkersLG
                      , markerClusterGroup: markerClusterGroup
                      , heatMap: heatMap
      // , 'Καλλικρατικοί δήμοι': ota_Callicrates
    };
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
    console.log('map::render() props:')
    console.log(this.props)
    console.log('map::render() context is:', this.props.context);
    const viewportHeight = $(window).height();
    console.log(`Map::render(): viewportHeight is [${viewportHeight}], tileProviderId is [${this.props.tileProviderId}]`);
    return (
      <div id='map-id' style={{height: `${this.getMapHeight()}px`}}>
      </div>
    );
  }

  clickOnCircleMarker = (e) => {
    if (this.props.selectedTool === SELECT_TOOL) {
      this.props.updateTarget(e.target.options.targetId);
      console.log(`clickOnCircleMarker: ${Object.keys(e.target.options).join(', ')}`);
    }
  }
  
}

const Athens = [37.98, 23.72];

class LayerConfiguration {
  constructor(minZoomLevel) {
    this.minZoomLevel = minZoomLevel;
  }
}

const LayersConfiguration = {
  circleMarkersLG    : new LayerConfiguration(14),
  circlesLG          : new LayerConfiguration(14),
  treesLG            : new LayerConfiguration(13),
  defaultMarkersLG   : new LayerConfiguration(13),
  makiMarkersLG      : new LayerConfiguration(16),
  markerClusterGroup : new LayerConfiguration(0),
  heatMap            : new LayerConfiguration( 5)
  //    , 'Καλλικρατικοί δήμοι'              : new LayerConfiguration( 0)
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

function randomItem(items) {
  const rv = items[Math.floor(Math.random() * items.length)];
  return rv;
}






function unpack(str) {
  var codePoints = [];
  for(var i = 0; i < str.length; i++)
    codePoints.push( str.charCodeAt(i) );
  return codePoints;
};




