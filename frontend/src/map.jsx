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


import './ots/wise-leaflet-pip.js';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
//import '../node_modules/leaflet-draw/dist/leaflet.draw.js';

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

import {numOfLayersInLayerGroup} from './leaflet-util.js';

// const Buffer = require('buffer').Buffer;
// const Iconv  = require('iconv').Iconv;

import {GSN, globalSet} from './globalStore.js';

import '../node_modules/leaflet-measure/dist/leaflet-measure.en.js';
import '../node_modules/leaflet-measure/dist/leaflet-measure.css';



import {Athens, ota_Callicrates, treeOverlays, defaultMarkerStyle} from './tree-markers.js';


import {CLEAR_DRAW_WORKSPACE
      , INSERT_GEOJSON_INTO_WORKSPACE} from './constants/flags.js';

import {MODAL_ADD_GEOMETRY} from './constants/modal-types.js';

import { connect }          from 'react-redux';
import {updateMouseCoords
      , clearFlag
      , displayModal
      , toggleTarget}  from './actions/index.js';


const tentativePolygonStyle = {weight: 2, dashArray: '6'};


const mapStateToProps = (state) => {
  return {
    tileProviderId                 : state.tileProviderId
    , clearDrawWorkspace           : state.flags[CLEAR_DRAW_WORKSPACE]
    , insertGeoJSONIntoWorkspace   : state.flags[INSERT_GEOJSON_INTO_WORKSPACE]
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCoordinates                   : (latlng)   => dispatch(updateMouseCoords(latlng))
    , clearDrawWorkspaceFlag            : ()         => dispatch(clearFlag(CLEAR_DRAW_WORKSPACE))
    , clearInsertGeoJSONIntoWorkspaceFlag: ()        => dispatch(clearFlag(INSERT_GEOJSON_INTO_WORKSPACE))
    , displayAddPolygonDialog           : (polygonId, polygon)  => dispatch(displayModal(MODAL_ADD_GEOMETRY, {polygonId, polygon}))
    , toggleTarget                      : (targetId) => dispatch(toggleTarget(targetId))
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
    super(props);/*
    this.state = {
      highlightedMarker: null
    };*/
    this.layerGroup = null;
    this.clickableLayers = [];
    this.highlightedMarker = null;
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
    return true;
  }


  componentWillUnmount = () => {
    console.log('map::componentWillUnmount()');
    window.removeEventListener ('resize', this.handleResize);
    this.map.off('click');
  }


  installNewDrawWorkspace = (featureGroup) => {
    if (this.drawnItems!==undefined) {
      assert.isNotNull(this.drawnItems);
      this.drawnItems.clearLayers();
      this.layersControl.removeLayer(this.drawnItems);
      this.map.removeLayer(this.drawnItems);
      this.map.removeControl(this.drawControl);
    }
    
    this.drawnItems = featureGroup;
    this.layersControl.addOverlay(this.drawnItems, 'επιφάνεια εργασίας');      
    globalSet(GSN.LEAFLET_DRAWN_ITEMS, this.drawnItems);
    this.map.addLayer(this.drawnItems);
    this.drawControl = new L.Control.Draw({
      draw: {
        polyline: true,
        circleMarker: true,
        rectangle: true,
        marker: true,
        polygon: {
          shapeOptions: {
            color: 'purple'
          },
          allowIntersection: false,
          drawError: {
            color: 'orange',
            timeout: 1000
          },
          showArea: true,
          metric: true
        }
      },
      edit: {
        featureGroup: this.drawnItems
      }
    });
    this.map.addControl(this.drawControl);
  }

  countTreesInLayer = (layer) => {
    let count = 0;
    this.clickableLayers.forEach( (markers) => {
      markers.eachLayer ( (marker)=>{
        if (layer instanceof L.Polygon) {
          if (layer.contains(marker.getLatLng())) {
            count++;
          }
        } else if (layer instanceof L.Circle) {
          if (layer.getLatLng().distanceTo(marker.getLatLng()) <= layer.getRadius()) {
            count++;
          }
        }
      });
    });
    return count;
  }
  

  countTreesInDrawWorkspace = () => {
    console.log('countTreesInDrawWorkspace');
    let count = 0;
    this.drawnItems.eachLayer( (layer) => {
      count += this.countTreesInLayer(layer);
    });
    console.log(`${count} trees within layer`);
  }

  componentDidMount = () => {
    window.addEventListener    ('resize', this.handleResize);
    this.map = L.map('map-id', {
      center: Athens,
      zoom: 15,
      zoomControl: false
    });
    this.map.doubleClickZoom.disable();

    const options = {position: 'topleft'
                   , primaryLengthUnit: 'meters'
                   , secondaryLengthUnit: 'kilometers'
                   , primaryAreaUnit: 'sqmeters'
                   , secondaryAreaUnit: 'hectares'
                  ,  decPoint: ','
                   , thousandsSep: '.'
                   , activeColor: '#A1EB0E'
                   , completedColor: '#DEAE09'};
    const measureControl = new L.Control.Measure(options);
    measureControl.addTo(this.map);


    this.addLayerGroupsExceptPromisingLayers();

    this.installNewDrawWorkspace(new L.FeatureGroup());

    this.map.on('draw:created', (e) => {
      const type = e.layerType,
            layer = e.layer;
      this.drawnItems.addLayer(layer);
      if (type==='polygon') {
        console.log(`area is ${L.GeometryUtil.geodesicArea(layer.getLatLngs())}`);
        const treesInPolygon = this.countTreesInLayer(layer);
        layer.bindPopup(`<b>${treesInPolygon}</b><br>10 ελιές, 20 εσπεριδοεϊδή.`).openPopup();
        }
    });

    const eventsToTriggerCounting = ['draw:created', 'draw:edited', 'draw:saved'
                                   , 'draw:deleted'];
    eventsToTriggerCounting.forEach( (v) => {
      this.map.on(v, this.countTreesInDrawWorkspace);
      });

    
    if (true)
      this.map.on('mousemove', (e) => {
        this.props.updateCoordinates(e.latlng);
      })
    this.map.on('click', this.handleClick);

    $('div.leaflet-control-container section.leaflet-control-layers-list div.leaflet-control-layers-overlays input.leaflet-control-layers-selector[type="checkbox"]').on('change', (e)=>{
    });
  }


  addLayerGroupsExceptPromisingLayers = () => {
    const overlays = {};
    overlays['Καλλικράτης'] = ota_Callicrates;
    this.layersControl = L.control.layers(BaseLayersForLayerControl, overlays).addTo(this.map);
    BaseLayersForLayerControl.ESRI.addTo(this.map);
  }

  addLayerGroupsForPromisingLayers = () => {
    const promise = treeOverlays();
    promise.then(({targetId2Marker, overlays}) => {
      for (const layerName in overlays) {
        const layerGroup = overlays[layerName];
        this.targetId2Marker = Object.assign({}
                                           , (this.targetId2Marker===null)?{}:this.targetId2Marker
                                           , targetId2Marker);
        console.log('retrieved targetdId2Marker and markers');
        console.log(targetId2Marker);
        console.log(layerGroup);
        console.log(this.map);
        layerGroup.addTo(this.map);
        this.clickableLayers.push(layerGroup);
        this.addClickListenersToMarkersOnLayer(layerGroup);
        this.layersControl.addOverlay(layerGroup, layerName);
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.loginContext.username===null) && (this.props.loginContext.username!==null))
      this.addLayerGroupsForPromisingLayers();

    if (!prevProps.clearDrawWorkspace && this.props.clearDrawWorkspace) {
      console.log('map - I have to clear the draw workspace');
      this.drawnItems.clearLayers();
      this.props.clearDrawWorkspaceFlag();
    } else if (prevProps.clearDrawWorkspace && !this.props.clearDrawWorkspace) {
      console.log('map - clear draw workspace flag is cleared');
    }


    if (!prevProps.insertGeoJSONIntoWorkspace && this.props.insertGeoJSONIntoWorkspace) {
      console.log('map - I have to insert GeoJSON into the draw workspace');
      const geoJSON = this.props.insertGeoJSONIntoWorkspace; // the flag is a geoJSON object in this case
      this.installNewDrawWorkspace(L.geoJSON(geoJSON));
      this.props.clearInsertGeoJSONIntoWorkspaceFlag();
    } else if (prevProps.insertGeoJSONIntoWorkspace && !this.props.insertGeoJSONIntoWorkspace) {
      console.log('map - insert GeoJSON into the draw workspace flag is cleared');
    }    


  }



  addClickListenersToMarkers = () => {
    console.log('addClickListenersToMarkers');
    this.clickableLayers.forEach( (layer) => {
      this.addClickListenersToMarkersOnLayer(layer);
    });
  }

  addClickListenersToMarkersOnLayer = (layer) => {
    layer.eachLayer ( (marker)=>{
      marker.on('click', this.clickOnCircleMarker);
      console.log('addClickListenersToMarkers : A');
      marker.options.interactive = true; // https://stackoverflow.com/a/60642381/274677
    }); // eachLayer
  }
  
  removeClickListenersFromMarkers = () => {
    this.clickableLayers.forEach( (markers) => {    
      markers.eachLayer ( (marker)=>{
        marker.off('click');
        marker.options.interactive = false; // https://stackoverflow.com/a/60642381/274677
      } ); // eachLayer
    }); // forEach
  }
  

  render() {
    const style = {height: `${this.getMapHeight()}px`};
    return (
      <div id='map-id' style={style}>
      </div>
    );
  }

  clickOnCircleMarker = (e) => {
    
    const installNewHighlightingMarker = (coords, targetId) => {
      const options = {radius: 20, color: 'black', weight: 5, interactive: false};
      const marker = L.circleMarker(coords, options);
      this.highlightedMarker = {marker, targetId};
      this.highlightedMarker.marker.addTo(this.map);
      this.highlightedMarker.marker.bringToBack();
    };

    const targetId = e.target.options.targetId;    
    const coords = this.targetId2Marker[targetId].getLatLng();

    
    if (this.highlightedMarker === null) {
      installNewHighlightingMarker(coords, targetId);
    } else {
      if (this.highlightedMarker.targetId === targetId) {
        this.highlightedMarker.marker.removeFrom(this.map);
        this.highlightedMarker = null;
      } else {
        this.highlightedMarker.marker.removeFrom(this.map);
        installNewHighlightingMarker(coords, targetId);
      }
    }
    this.props.toggleTarget(e.target.options.targetId);
  }


}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(Map));

