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


import {Athens, layerGroups, defaultMarkerStyle, targetId2Marker, USE_CLASSICAL_MARKERS} from './tree-markers.js';


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
    console.log('Map::constructor is called');
    super(props);
    this.state = {
      userDefinedGeometries: [],
      geometryUnderDefinition: [],
      highlightedMarker: null
    };
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
    console.log('map::handleClick', e, e.latlng);
    this.props.updateCoordinates(e.latlng);
    switch (this.props.selectedTool) {

      case null:
        break;
      case SELECT_TREE_TOOL:
        console.log('select tree tool case');
        break;
        this.addBeacon(e.latlng);
        break;        
      case ADD_BEACON_TOOL:
        this.addBeacon(e.latlng);
        break;
      case SELECT_GEOMETRY_TOOL:
        this.selectGeometry(e.latlng);
        break;
      case DEFINE_POLYGON_TOOL:
        this.addPointToPolygonUnderConstruction(e.latlng);
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

  addBeacon = ({lat, lng}) => {
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
  }


  selectGeometry = ({lat, lng}) => {
    const polygon = this.state.geometryUnderDefinition.map( (e) => [e.lat, e.lng]);
    const isInside = inside([lat, lng], polygon);
  }

  addPointToPolygonUnderConstruction = ({lat, lng})=>{
    console.log('addPointToPolygonUnderConstruction');
    this.setState({geometryUnderDefinition: [...this.state.geometryUnderDefinition, {lat, lng}]});
  }

  drawPolygon = () => {
    if (this.props.selectedTool===DEFINE_POLYGON_TOOL) {
      console.log('updating polygon');
      if (this.currentPolygon!=null)
        this.currentPolygon.setLatLngs(this.state.geometryUnderDefinition);
      else
        this.currentPolygon = L.polygon(this.state.geometryUnderDefinition).addTo(this.map);
    }
    if (false) {
      if (this.currentPolygon!=null)
        this.map.removeLayer(this.currentPolygon);
      if ((this.props.selectedTool===DEFINE_POLYGON_TOOL) && (this.state.geometryUnderDefinition.length!==0)) {
        this.currentPolygon = L.polygon(this.state.geometryUnderDefinition).addTo(this.map);
      }
    }
  }



  componentDidUnmount = () => {
    console.log('map::componentDidUnmount()');
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
    this.configureLayerGroups();
    if (false)
      this.map.on('mousemove', (e) => {
        this.props.updateCoordinates(e.latlng);
      })
    this.map.on('click', this.handleClick);

    L.control.layers(BaseLayersForLayerControl).addTo(this.map);

    $('div.leaflet-control-container section.leaflet-control-layers-list div.leaflet-control-layers-overlays input.leaflet-control-layers-selector[type="checkbox"]').on('change', (e)=>{
      console.log('checkbox changed', e);
    });
    assert.strictEqual(this.props.selectedTool, SELECT_TREE_TOOL);
    this.addClickListenersToMarkers();    
    
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('map::componentDidUpdate');
    if (prevProps.tileProviderId!==this.props.tileProviderId) {
      this.addTiles();
    }
    if (prevProps.selectedTool === this.props.selectedTool) {
      console.log('same tool');
      if (prevState.geometryUnderDefinition.length !== this.state.geometryUnderDefinition.length) {
        console.log('different geometry - need to drawPolygon');
        this.drawPolygon();
      }
    } else {
      console.log('xxx selected tool changed');
      let totalTransitionsFired = 0;
      totalTransitionsFired += this.handleToolTransition_SELECT_TREE       (prevProps);
      totalTransitionsFired += this.handleToolTransition_DEFINE_POLYGON    (prevProps);
      assert.isAtMost(totalTransitionsFired, 2);
    }
    this.takeCareOfHighlightedMarker(prevState.highlightedMarker, this.state.highlightedMarker);
  }


  handleToolTransition_SELECT_TREE = (prevProps) => {
    console.log('xxx', prevProps.selectedTool, this.props.selectedTool);
    if (exactlyOne(  (prevProps.selectedTool === SELECT_TREE_TOOL)
                  , (this.props.selectedTool === SELECT_TREE_TOOL))) {
      console.log('xxx foo');
      if (this.props.selectedTool === SELECT_TREE_TOOL) {
        console.log('xxx select tree tool was just selected - re-enable marker listeners');
        this.addClickListenersToMarkers();
      } else  {
        console.log('xxx select tree tool was just deselected - disable marker listeners');
        this.removeClickListenersFromMarkers();
      }
      return 1;
    }
    return 0;
  }

  
  handleToolTransition_DEFINE_POLYGON = (prevProps) => {
    if ((prevProps.selectedTool !== DEFINE_POLYGON_TOOL) && (this.props.selectedTool === DEFINE_POLYGON_TOOL)) {
      console.log('polygon tool was just selected - start monitoring keyUp');
      window.addEventListener ('keyup', this.handleKeyUp);
      return 1;
    } else if ((prevProps.selectedTool === DEFINE_POLYGON_TOOL) && (this.props.selectedTool !== DEFINE_POLYGON_TOOL)) {
      console.log('polygon tool was just de-selected - stop monitoring keyUp');
      window.removeEventListener ('keyup', this.handleKeyUp);
      return 1;
    }
    return 0;
  }

  handleKeyUp = (e) => {
    console.log(`key up detected ${e.keyCode}`);
    if (e.keyCode === keycode('ESC')) {
      assert.strictEqual(this.props.selectedTool, DEFINE_POLYGON_TOOL);
      const userDefinedGeometriesSoFar = _.cloneDeep(this.state.userDefinedGeometries);
      userDefinedGeometriesSoFar.push(this.state.geometryUnderDefinition);
      this.currentPolygon = null;
      this.setState({userDefinedGeometries: userDefinedGeometriesSoFar
                   , geometryUnderDefinition: []});
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

  
  configureLayerGroups = () => {
    for (let x in layerGroups) {
      if (layerGroups[x].enabled)
        layerGroups[x].layer.addTo(this.map);
    }
  }

  addClickListenersToMarkers = () => {
    console.log('xxx adding click listeners to all trees');
    layerGroups.circleMarkersLG.layer.eachLayer ( (marker)=>{
      marker.on('click', this.clickOnCircleMarker);
      if (USE_CLASSICAL_MARKERS)
        marker._icon.classList.remove('not-selectable');
      else {
        marker.options.interactive = true; // https://stackoverflow.com/a/60642381/274677
        console.log(marker.options.interactive);
        }
    });
  }

  removeClickListenersFromMarkers = () => {
    console.log('xxx removing click listeners from all trees');
    layerGroups.circleMarkersLG.layer.eachLayer ( (marker)=>{
      console.log(marker);
      marker.off('click');
      if (USE_CLASSICAL_MARKERS) 
        marker._icon.classList.add('not-selectable');
      else {
        marker.options.interactive = false; // https://stackoverflow.com/a/60642381/274677
        console.log(marker.options.interactive);
        }
    } );
  }
  

  render() {
    console.log('map::render()');
    const viewportHeight = $(window).height();
    return (
      <div id='map-id' style={{height: `${this.getMapHeight()}px`}}>
      </div>
    );
  }

  clickOnCircleMarker = (e) => {
    console.log('clickOnCircleMarker');
    const targetId = e.target.options.targetId;
    const marker = targetId2Marker[targetId];
    console.log(marker.options);
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










