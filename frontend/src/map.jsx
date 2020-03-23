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

import {exactlyOne, allStrictEqual} from './util.js';
import {BaseLayers, BaseLayersForLayerControl} from './baseLayers.js';
import {DefaultIcon, TreeIcon}          from './icons.js';
import rainbow from './rainbow.js';

import {CustomCircleMarker} from './custom-markers.js';
import wrapContexts from './context/contexts-wrapper.jsx';

// const Buffer = require('buffer').Buffer;
// const Iconv  = require('iconv').Iconv;


import {Athens, layerGroups, defaultMarkerStyle, USE_CLASSICAL_MARKERS} from './tree-markers.js';


import {SELECT_TREE, DEFINE_POLYGON, ADD_BEACON, SELECT_GEOMETRY} from './constants/modes.js';
import {DELETE_GEOMETRY_UNDER_DEFINITION}                         from './constants/flags.js';
import {MODAL_ADD_GEOMETRY}                                       from './constants/modal-types.js';

import { connect }          from 'react-redux';
import {updateMouseCoords
      , clearFlag
      , addPointToPolygonUnderConstruction
      , displayModal
      , updateTarget}  from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    tileProviderId                 : state.tileProviderId
    , mode                         : state.mode
    , userDefinedGeometries        : state.userDefinedGeometries
    , geometryUnderDefinition      : state.geometryUnderDefinition
    , deleteGeometryUnderDefinition: state.flags.DELETE_GEOMETRY_UNDER_DEFINITION
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCoordinates                   : (latlng)   => dispatch(updateMouseCoords(latlng))
    , clearDeleteGeometryUnderDefinition: ()         => dispatch(clearFlag(DELETE_GEOMETRY_UNDER_DEFINITION))
    , addPointToPolygonUnderConstruction: (latlng)   => dispatch(addPointToPolygonUnderConstruction(latlng))
    , displayAddPolygonDialog           : ()         => dispatch(displayModal(MODAL_ADD_GEOMETRY))
    , updateTarget                      : (targetId) => dispatch(updateTarget(targetId))
    };
  }


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
    this.state = {
      highlightedMarker: null
    };
    this.layerGroup = null;
    this.currentPolygon = null;
    this.currentPolygonPoints = [];
    this.clickableLayers = [];
  }

  getMapHeight = () => {
    return this.props.geometryContext.screen.height - this.props.geometryContext.geometry.headerBarHeight
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
    switch (this.props.mode) {

      case null:
        break;
      case SELECT_TREE:
        break;        
      case ADD_BEACON:
        this.addBeacon(e.latlng, 20, 2000);
        break;
      case SELECT_GEOMETRY:
        this.selectGeometry(e.latlng);
        break;
      case DEFINE_POLYGON:
        console.log(e);
        console.log(e.latlng);
        this.addBeacon(e.latlng, 10, 1000);
        this.props.addPointToPolygonUnderConstruction(e.latlng);
        break;
      case MOVE_VERTEX:
        break;
      case REMOVE:
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
    const marker = L.marker([lat, lng],{icon: pulsingIcon});
    marker.addTo(this.map);
    window.setTimeout(()=>{
      this.map.removeLayer(marker);
      console.log('marker is removed');
    }, durationMS);
  }


  selectGeometry = ({lat, lng}) => {
    const polygon = this.props.geometryUnderDefinition.map( (e) => [e.lat, e.lng]);
    const isInside = inside([lat, lng], polygon);
  }

  drawPolygon = () => {
    assert.strictEqual(this.props.mode, DEFINE_POLYGON);
    if (this.currentPolygon==null) {
      if (this.layerGroup===null) {
        this.layerGroup = L.layerGroup();
        this.map.addLayer(this.layerGroup);
        this.layersControl.addOverlay(this.layerGroup, 'custom layer');        
        console.log('new layerGroup added to maps and control');
      }
      // start defining new polygon and clear currently accumulated points
      this.currentPolygon = L.polygon(this.props.geometryUnderDefinition);
      this.layerGroup.addLayer(this.currentPolygon);

      this.currentPolygonPoints = [];
      console.log('new polygon and overlay added to map');
    }
    else {
      this.currentPolygon.setLatLngs(this.props.geometryUnderDefinition);      
    }

    const latestPoint = this.props.geometryUnderDefinition[this.props.geometryUnderDefinition.length-1];
    console.log(latestPoint);
    var circle = L.circle([latestPoint.lat, latestPoint.lng], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 10
    }).addTo(this.map);
    this.layerGroup.addLayer(circle);
    this.currentPolygonPoints.push(circle);

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
    console.log('wwwwwww calling addtiles');
    this.addTiles();
    this.addLayerGroupsExceptPromisingLayers();
    if (true)
      this.map.on('mousemove', (e) => {
        this.props.updateCoordinates(e.latlng);
      })
    this.map.on('click', this.handleClick);

    $('div.leaflet-control-container section.leaflet-control-layers-list div.leaflet-control-layers-overlays input.leaflet-control-layers-selector[type="checkbox"]').on('change', (e)=>{
    });
    assert.strictEqual(this.props.mode, SELECT_TREE);
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
    if ((prevProps.loginContext.username===null) && (this.props.loginContext.username!==null))
      this.addLayerGroupsForPromisingLayers();
    if (this.props.deleteGeometryUnderDefinition) {
      assert.strictEqual(this.props.mode, null);
      assert.isTrue(this.currentPolygon != null, 'this.currentPolygon is curiously null');
      assert.isTrue(this.layerGroup     != null, 'this.layerGroup is curiously null');      
      this.layersControl.removeLayer(this.layerGroup);
      this.map.removeLayer(this.layerGroup);
      this.currentPolygon = null;
      this.layerGroup = null;
      this.currentPolygonPoints.forEach( (x) => {
        this.map.removeLayer(x);
      });
      this.currentPolygonPoints = [];
      this.props.clearDeleteGeometryUnderDefinition();
    }
    if (prevProps.tileProviderId!==this.props.tileProviderId) {
      this.addTiles();
    }
    if (allStrictEqual([prevProps.mode, this.props.mode, DEFINE_POLYGON])) {
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
    if (exactlyOne(  (prevProps.mode === SELECT_TREE)
                  , (this.props.mode === SELECT_TREE))) {
      if (this.props.mode === SELECT_TREE) {
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
    if ((prevProps.mode !== DEFINE_POLYGON) && (this.props.mode === DEFINE_POLYGON)) {
      window.addEventListener ('keyup', this.handleKeyUp);
      return 1;
    } else if ((prevProps.mode === DEFINE_POLYGON) && (this.props.mode !== DEFINE_POLYGON)) {
      window.removeEventListener ('keyup', this.handleKeyUp);
      return 1;
    }
    return 0;
  }


  handleKeyUp = (e) => {
    if (e.keyCode === keycode('ESC')) {
      assert.strictEqual(this.props.mode, DEFINE_POLYGON);
      this.currentPolygon = null;
      this.props.displayAddPolygonDialog();
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
      if (this.props.mode === DEFINE_POLYGON) {
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
        previousMarker.setStyle(defaultMarkerStyle());
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


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(Map));

