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
const assert = require('chai').assert;

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';
import inside from 'point-in-polygon';
import keycode from 'keycode';

require('../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css');
require('../node_modules/leaflet.markercluster/dist/leaflet.markercluster.js');

import {exactlyOne} from './util.js';
import {BaseLayers, BaseLayersForLayerControl} from './baseLayers.js';
import {DefaultIcon, TreeIcon}          from './icons.js';
import rainbow from './rainbow.js';

import {CustomCircleMarker} from './custom-markers.js';
import {GeometryContext} from './context/geometry-context.jsx';
// const Buffer = require('buffer').Buffer;
// const Iconv  = require('iconv').Iconv;


import {Athens, layerGroups, defaultMarkerStyle, USE_CLASSICAL_MARKERS} from './tree-markers.js';


import {SELECT_TREE_TOOL, ADD_BEACON_TOOL, SELECT_GEOMETRY_TOOL, DEFINE_POLYGON_TOOL, MOVE_VERTEX_TOOL, REMOVE_TOOL} from './map-tools.js';

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
    super(props);
    this.state = {
      highlightedMarker: null
    };
    this.currentPolygonPoints = [];
    this.clickableLayers = [];
  }

  getMapHeight = () => {
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

  handleClick = (e) => {
    this.props.updateCoordinates(e.latlng);
    switch (this.props.selectedTool) {

      case null:
        break;
      case SELECT_TREE_TOOL:
        break;        
      case ADD_BEACON_TOOL:
        this.addBeacon(e.latlng, 20, 2000);
        break;
      case SELECT_GEOMETRY_TOOL:
        this.selectGeometry(e.latlng);
        break;
      case DEFINE_POLYGON_TOOL:
        this.addBeacon(e.latlng, 10, 1000);
        this.props.addPointToPolygonUnderConstruction(e.latlng);
        break;
      case MOVE_VERTEX_TOOL:
        break;
      case REMOVE_TOOL:
        break;
      default:
        assert.fail('not handled 6');
    }
    return true;
  }

  addBeacon = ({lat, lng}, size, durationMS) => {
    const pulsingIcon = L.icon.pulse(
      {iconSize:[size,size]
     , color:'red'
     , animate: true
     , heartbeat: 0.4
      });
    const marker = L.marker([lat, lng],{icon: pulsingIcon}).addTo(this.map);
    marker.addTo(this.map);
    window.setTimeout(()=>{
      this.map.removeLayer(marker);
    }, durationMS);
  }


  selectGeometry = ({lat, lng}) => {
    const polygon = this.props.geometryUnderDefinition.map( (e) => [e.lat, e.lng]);
    const isInside = inside([lat, lng], polygon);
  }

  drawPolygon = () => {
    console.log('drawPolygon');
    if (this.props.selectedTool===DEFINE_POLYGON_TOOL) {
      console.log(`this.props.geometryUnderDefinition.length=${this.props.geometryUnderDefinition.length}`);

      if (this.currentPolygon!=null) {
        console.log(this.props.geometryUnderDefinition);
        this.currentPolygon.setLatLngs(this.props.geometryUnderDefinition);
      }
      else {
        // start defining new polygon and clear currently accumulated points
        this.currentPolygon = L.polygon(this.props.geometryUnderDefinition).addTo(this.map);
        this.currentPolygonPoints = [];
      }

      const latestPoint = this.props.geometryUnderDefinition[this.props.geometryUnderDefinition.length-1];
      console.log(latestPoint);
      var circle = L.circle([latestPoint.lat, latestPoint.lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 10
      }).addTo(this.map);
      this.currentPolygonPoints.push(circle);

    }
  }

  componentWillUnmount = () => {
    console.log('map::componentWillUnmount()');
    window.removeEventListener ('resize', this.handleResize);
    this.map.off('click');
  }

  componentDidMount = () => {
    console.log('map::componentDidMount()');
    window.addEventListener    ('resize', this.handleResize);
    this.map = L.map('map-id', {
      center: Athens,
      zoom: 15,
      zoomControl: false
    });
    this.addTiles();
    this.addLayerGroupsExceptPromisingLayers();
    this.addLayerGroupsForPromisingLayers();
    if (false)
      this.map.on('mousemove', (e) => {
        this.props.updateCoordinates(e.latlng);
      })
    this.map.on('click', this.handleClick);

    $('div.leaflet-control-container section.leaflet-control-layers-list div.leaflet-control-layers-overlays input.leaflet-control-layers-selector[type="checkbox"]').on('change', (e)=>{
    });
    assert.strictEqual(this.props.selectedTool, SELECT_TREE_TOOL);
  }


  addLayerGroupsExceptPromisingLayers = () => {
    const layersForControl = {};
    for (const x in layerGroups) {
      if (layerGroups[x].containsMapOfTargetIds) { // this is the only case where a promise is returned
        ; // do nothing
      } else {
        const layer = layerGroups[x].layer();
        if (layerGroups[x].isInitiallyDisplayed) {
          layer.addTo(this.map);
        }
        layersForControl[x] = layer;
      }
    } // for
    this.layersControl = L.control.layers(BaseLayersForLayerControl, layersForControl).addTo(this.map);
  }

  addLayerGroupsForPromisingLayers = () => {
    const layersForControl = {};
    for (let x in layerGroups) {
      if (layerGroups[x].isInitiallyDisplayed) {
        if (layerGroups[x].containsMapOfTargetIds) { // this is the only case where a promise is returned
          const promise = layerGroups[x].layer();
          promise.then( ({targetId2Marker, layerGroup}) => {
            this.targetId2Marker = Object.assign({}
                                               , (this.targetId2Marker===null)?{}:this.targetId2Marker
                                               , targetId2Marker);
            console.log('retrieved targetdId2Marker and markers');
            console.log(targetId2Marker);
            console.log(layerGroup);
            console.log(this.map);
            layerGroup.addTo(this.map);
            this.clickableLayers.push(layerGroup);
            this.addClickListenersToMarkers();
            this.layersControl.addOverlay(layerGroup, x);
          }); // promise.then
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.deleteGeometryUnderDefinition) {
      console.log('deleting geometry under definition');
      assert.strictEqual(this.props.selectedTool, null);
      assert.isTrue(this.currentPolygon != null, 'this.currentPolygon is curiously null');
      this.map.removeLayer(this.currentPolygon);
      this.currentPolygon = null;
      this.currentPolygonPoints.forEach( (x) => {
        this.map.removeLayer(x);
      });
      this.currentPolygonPoints = [];
      this.props.clearDeleteGeometryUnderDefinition();
    }
    if (prevProps.tileProviderId!==this.props.tileProviderId) {
      this.addTiles();
    }
    if (prevProps.selectedTool === this.props.selectedTool) {
      if ((prevProps.geometryUnderDefinition.length !== this.props.geometryUnderDefinition.length)
          &&
          (this.props.geometryUnderDefinition.length>0)) {
        console.log(`drawing polygon with ${this.props.geometryUnderDefinition.length} points defined`);
        this.drawPolygon();
        }
    } else {
      let totalTransitionsFired = 0;
      totalTransitionsFired += this.handleToolTransition_SELECT_TREE       (prevProps);
      totalTransitionsFired += this.handleToolTransition_DEFINE_POLYGON    (prevProps);
      assert.isAtMost(totalTransitionsFired, 2);
    }
    this.takeCareOfHighlightedMarker(prevState.highlightedMarker, this.state.highlightedMarker);
  }


  handleToolTransition_SELECT_TREE = (prevProps) => {
    if (exactlyOne(  (prevProps.selectedTool === SELECT_TREE_TOOL)
                  , (this.props.selectedTool === SELECT_TREE_TOOL))) {
      if (this.props.selectedTool === SELECT_TREE_TOOL) {
        this.addClickListenersToMarkers();
      } else  {
        console.log('removing marker click listeners');
        this.removeClickListenersFromMarkers();
      }
      return 1;
    }
    return 0;
  }

  
  handleToolTransition_DEFINE_POLYGON = (prevProps) => {
    if ((prevProps.selectedTool !== DEFINE_POLYGON_TOOL) && (this.props.selectedTool === DEFINE_POLYGON_TOOL)) {
      window.addEventListener ('keyup', this.handleKeyUp);
      return 1;
    } else if ((prevProps.selectedTool === DEFINE_POLYGON_TOOL) && (this.props.selectedTool !== DEFINE_POLYGON_TOOL)) {
      window.removeEventListener ('keyup', this.handleKeyUp);
      return 1;
    }
    return 0;
  }


  handleKeyUp = (e) => {
    if (e.keyCode === keycode('ESC')) {
      assert.strictEqual(this.props.selectedTool, DEFINE_POLYGON_TOOL);
      this.currentPolygon = null;
      this.props.addPolygon();
    }
  }

  addTiles() {
    const currentTileLayer = this.getCurrentTileLayer();
    if (currentTileLayer!==null) {
      this.map.removeLayer(currentTileLayer);
    }
    const {tileProviderId} = this.props;
    const newBaseLayer = BaseLayers[tileProviderId].tileLayer;
    assert.isDefined(newBaseLayer);
    newBaseLayer.addTo(this.map);
  }

  

  addClickListenersToMarkers = () => {
    this.clickableLayers.forEach( (markers) => {
      markers.eachLayer ( (marker)=>{
        marker.on('click', this.clickOnCircleMarker);
        if (USE_CLASSICAL_MARKERS)
          marker._icon.classList.remove('not-selectable');
        else {
          marker.options.interactive = true; // https://stackoverflow.com/a/60642381/274677
        }
      }); // eachLayer
    }); // forEach
  }

  removeClickListenersFromMarkers = () => {
    this.clickableLayers.forEach( (markers) => {    
      markers.eachLayer ( (marker)=>{
        marker.off('click');
        if (USE_CLASSICAL_MARKERS) 
          marker._icon.classList.add('not-selectable');
        else {
          marker.options.interactive = false; // https://stackoverflow.com/a/60642381/274677
        }
      } ); // eachLayer
    }); // forEach
  }
  

  render() {
    const style = (()=>{
      const style = {height: `${this.getMapHeight()}px`};
      if (this.props.selectedTool === DEFINE_POLYGON_TOOL) {
        Object.assign(style, {cursor: 'crosshair'});
      }
      return style;
    })();

    return (
      <div id='map-id' style={style}>
      </div>
    );
  }

  clickOnCircleMarker = (e) => {
    const targetId = e.target.options.targetId;
    const marker = this.targetId2Marker[targetId];
    this.setState({highlightedMarker: marker});
    this.props.updateTarget(e.target.options.targetId);
  }

  takeCareOfHighlightedMarker(previousMarker, newMarker) {
    if (previousMarker !== newMarker) {
      if (previousMarker !== null) {
        previousMarker.setStyle(defaultMarkerStyle);
      }
      if (newMarker !== null) {
        newMarker.setStyle({
          color : '#ff0000',
          radius : 8
        });
      }
    }
  }
}



function getAllNonPromisingLayers(layerGroups) {
  const rv = [];
  for (const prop in layerGroups) {
    if (layerGroups.hasOwnProperty(prop)) {
      if (!layerGroups[prop].containsMapOfTargetIds) // these are the non-promising layers
        rv[prop] = layerGroups[prop].layer();
    }
  }
  return rv;
}

function getAllPromisingLayers(layerGroups) {
  const rv = [];
  for (const prop in layerGroups) {
    if (layerGroups.hasOwnProperty(prop)) {
      if (layerGroups[prop].containsMapOfTargetIds) { // these are the promising layers
        console.log(`adding promising layer ${prop}`);
        const promise = layerGroups[prop].layer()
                                         .then( ({targetId2Map, layerGroup}) => {
                                           console.log(`returning a layerGroup with the name ${prop}`);
                                           return {layerName: prop
                                                 , layer: layerGroup};
                                         });
        rv.push(promise);
      }
    }
  }
  return rv;
}






