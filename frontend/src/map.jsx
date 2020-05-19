require('./ots/leaflet-heat.js');

require('@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css');
require('@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.js');



window.shp=require('shpjs');
require('./ots/leaflet.shpfile.js');


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

import keycode from 'keycode';

require('../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css');
require('../node_modules/leaflet.markercluster/dist/leaflet.markercluster.js');

import {exactlyOne, allStrictEqual} from './util.js';
import {BaseLayersForLayerControl} from './baseLayers.js';
import {DefaultIcon, TreeIcon}          from './icons.js';
import rainbow from './rainbow.js';

import {CustomCircleMarker} from './custom-markers.js';
import wrapContexts from './context/contexts-wrapper.jsx';

import {layerIsEmpty, numOfLayersInLayerGroup} from './leaflet-util.js';

// const Buffer = require('buffer').Buffer;
// const Iconv  = require('iconv').Iconv;

import {GSN, globalSet} from './globalStore.js';

import '../node_modules/leaflet-measure/dist/leaflet-measure.en.js';
import '../node_modules/leaflet-measure/dist/leaflet-measure.css';

import {axiosAuth} from './axios-setup.js';

import {ota_Callicrates, treeOverlays} from './tree-markers.js';

import {ATHENS, DEFAULT_ZOOM} from './constants/map-constants.js';

import {MDL_NOTIFICATION} from './constants/modal-types.js';



import { connect }          from 'react-redux';
import {appIsDoneLoading
      , updateMouseCoords
      , displayModal
      , toggleTarget}  from './actions/index.js';


import TreeCountStatistic from './tree-count-statistic.js';

import {msgTreeDataIsDirty} from './common.jsx';



const mapStateToProps = (state) => {
  return {
    targetId                       : state.targetId,
    tileProviderId                 : state.tileProviderId,
    targetIsDirty                  : state.targetIsDirty
  };
};

const mapDispatchToProps = (dispatch) => {
  return {dispatch};
}

/*
 * SSE-1589888176
 * idiom for [mapDispatchToProps] and [mergeProps] described in:
 *     https://github.com/reduxjs/react-redux/issues/237#issuecomment-168816713
 *
 */
const mergeProps = ( {targetId, tileProviderId, targetIsDirty}, {dispatch}) => {
  return Object.assign({}, 
                       {targetId
                      , tileProviderId
                      , targetIsDirty
                      , appIsDoneLoading: ()=> dispatch(appIsDoneLoading())
                      , updateCoordinates                 : (latlng)   => dispatch(updateMouseCoords(latlng))
                      , toggleTarget                      : (targetId) => dispatch(toggleTarget(targetId))
                      , displayNotificationTargetIsDirty  : ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataIsDirty(targetId)}))
  });
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
    this.layerGroup = null;
    this.clickableLayers = [];
    this.highlightedMarker = null;
    this.queryLayer = null;
    globalSet(GSN.REACT_MAP, this);
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
    this.map.addLayer(this.drawnItems);
    this.drawControl = new L.Control.Draw({
      draw: {
        polyline: true,
        circlemarker: false, // GeoJSON does not support circles
        circle: false,       // --------------------------------
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

  installNewQueryLayer = (featureGroup) => {
//    let queryLayer = globalGet(GSN.LEAFLET_QUERY_LAYER, false);
    if (this.queryLayer!==null) {
      this.queryLayer.clearLayers();
      this.layersControl.removeLayer(this.queryLayer);
      this.map.removeLayer(this.queryLayer);
    }
    this.queryLayer = featureGroup;
    this.layersControl.addOverlay(this.queryLayer, 'query results');
    this.map.addLayer(this.queryLayer);
  }  

  countTreesInLayer = (layer) => {
    const rv = new TreeCountStatistic();
    this.clickableLayers.forEach( (markers) => {
      markers.eachLayer ( (marker)=>{
        if (layer instanceof L.Polygon) {
          if (layer.contains(marker.getLatLng())) {
            rv.increment(marker.options.kind);
          }
        }
      });
    });
    return rv;
  }
  

  countTreesInDrawWorkspace = () => {
    let count = 0;
    this.drawnItems.eachLayer( (layer) => {
      count += this.countTreesInLayer(layer).total;
    });
  }

  componentDidMount = () => {


    
    window.addEventListener    ('resize', this.handleResize);
    this.map = L.map('map-id', {
      center: ATHENS,
      zoom: DEFAULT_ZOOM,
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
      console.log(this.drawnItems.toGeoJSON(7));
      if (layer instanceof L.Polygon) {
        console.log(`area is ${L.GeometryUtil.geodesicArea(layer.getLatLngs())}`);
        const countResult = this.countTreesInLayer(layer);
        const treesConfiguration = this.props.treesConfigurationContext.treesConfiguration;
        const msg = 'it is inconceivable that, at this point, the TreesConfigurationContextProvider'
                   +' should have failed to obtain the treesConfiguration object. If this abomination should come'
                   +' to transpire then an approach similar to that used in ref:sse-1587477558 should be adopted.'
                   +' However, given that it is highly unlikely that this should ever come to pass, I consider'
                   +' it an overkill to adopt such an approach pre-emptively. In constrast, the approach in'
        +' ref:sse-1587477558 was, in fact, necessary';
        assert.exists(treesConfiguration, msg);
        const detailBreakdown = countResult.toDetailBreakdownString(treesConfiguration);
        layer.bindPopup(`<b>${countResult.total()}</b><br>${detailBreakdown}`).openPopup();
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
    setTimeout(()=>{this.props.appIsDoneLoading()}, 1000);
  }


  addLayerGroupsExceptPromisingLayers = () => {
    const overlays = {};
    overlays['Καλλικράτης'] = ota_Callicrates;
    this.layersControl = L.control.layers(BaseLayersForLayerControl, overlays).addTo(this.map);
    BaseLayersForLayerControl.ESRI.addTo(this.map);
  }

  addLayerGroupsForPromisingLayers = () => {
    // sse-1587477558
    const treesConfigurationIsNowAvailable = new Promise(
      (resolution, rejection) => {
        const testAvailability = () => {
          if (this.props.treesConfigurationContext.treesConfiguration!=null) {
            clearInterval(intervalId);
            resolution();
          } else
          ; // wait some more (it typically takes 5 ms to populate the treesConfiguration structure)
        }
        const intervalId = setInterval(testAvailability, 1);
      });
    treesConfigurationIsNowAvailable.then( ()=> {
      const promise = treeOverlays(this.props.treesConfigurationContext.treesConfiguration);
      promise.then(({overlays, id2marker}) => {
        this.id2marker = id2marker;
        for (const layerName in overlays) {
          const layerGroup = overlays[layerName];
          layerGroup.addTo(this.map);
          this.clickableLayers.push(layerGroup);
          this.addClickListenersToMarkersOnLayer(layerGroup);
          this.layersControl.addOverlay(layerGroup, layerName);
        }
      });
    }).catch( (v) => {
      assert.fail('not expecting this promise to fail: '+v); 
    } );
  }

  getMarker = (id) => {
    return this.id2marker[id];
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.loginContext.username===null) && (this.props.loginContext.username!==null)) {
      this.addLayerGroupsForPromisingLayers();
    }
  }

  insertGeoJSONIntoWorkspace = (geoJSON) => {
    const options = {pointToLayer: (geoJsonPoint, latlng) => {
      if (geoJsonPoint.properties.hasOwnProperty("targetId")) {
        const marker =  L.circleMarker(latlng, {targetId: geoJsonPoint.properties.targetId});
        marker.on('click', this.clickOnCircleMarker);
        marker.options.interactive = true;
        return marker;
      } else {
        return L.marker(latlng);
      }
    }};
    const [circleMarkersFG, restFG] = splitFeatureGroupIntoCircleMarkersAndTheRest(L.geoJSON(geoJSON, options));
    this.installNewDrawWorkspace(restFG);
    if (! layerIsEmpty(circleMarkersFG))
      this.installNewQueryLayer(circleMarkersFG);
  }



  addClickListenersToMarkers = () => {
    this.clickableLayers.forEach( (layer) => {
      this.addClickListenersToMarkersOnLayer(layer);
    });
  }

  addClickListenersToMarkersOnLayer = (layer) => {
    layer.eachLayer ( (marker)=>{
      marker.on('click', this.clickOnCircleMarker);
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
    if (this.props.targetIsDirty) {
      this.props.displayNotificationTargetIsDirty();
    } else {
      const installNewHighlightingMarker = (coords, targetId) => {
        const options = {radius: 20, color: 'black', weight: 5, interactive: false};
        const marker = L.circleMarker(coords, options);
        this.highlightedMarker = {marker, targetId};
        this.highlightedMarker.marker.addTo(this.map);
        this.highlightedMarker.marker.bringToBack();
        this.map.setView(coords, this.map.getZoom());
      };
      const targetId = e.target.options.targetId;
      const coords = e.target.getLatLng();


      
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


  getInfoOfMarkersInBounds = (bounds, exceptId) => {
    assert.isOk(bounds);
    const rv = []
    let encounteredExceptedMarker = false;
    let n = 0;
    this.clickableLayers.forEach( (markers) => {
      markers.eachLayer ( (marker)=>{
        if (marker instanceof L.CircleMarker && bounds.contains(marker.getLatLng())) {
          n ++;
          if (marker.options.targetId === exceptId)
            encounteredExceptedMarker = true;
          else {
            console.log(`${marker.options.targetId} != ${exceptId} - pushing kind = ${marker.options.kind}`);
            rv.push({latlng: marker.getLatLng(), kind: marker.options.kind});
          }
        }
      });
    });
    assert.isTrue((exceptId === undefined) || encounteredExceptedMarker);
    return rv;
  }
}

function splitFeatureGroupIntoCircleMarkersAndTheRest(featureGroup) {
  const circleMarkerLayers = [];
  const restLayers = [];
  featureGroup.eachLayer( (layer) => {
    if (layer instanceof L.CircleMarker)
      circleMarkerLayers.push(layer);
    else
      restLayers.push(layer);
  });
  return [L.featureGroup(circleMarkerLayers)
        , L.featureGroup(restLayers)];
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(wrapContexts(Map));

