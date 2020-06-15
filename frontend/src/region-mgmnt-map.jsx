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

import {exactlyOne, allStrictEqual} from './util/util.js';
import {BaseLayersForLayerControl} from './baseLayers.js';
import {DefaultIcon, TreeIcon}          from './icons.js';

import wrapContexts from './context/contexts-wrapper.jsx';

import {layerIsEmpty, numOfLayersInLayerGroup} from './leaflet-util.js';

// const Buffer = require('buffer').Buffer;
// const Iconv  = require('iconv').Iconv;

import { v4 as uuidv4 } from 'uuid';
import {GSN, globalSet} from './globalStore.js';

import '../node_modules/leaflet-measure/dist/leaflet-measure.en.js';
import '../node_modules/leaflet-measure/dist/leaflet-measure.css';

import {axiosAuth} from './axios-setup.js';

import {ota_Callicrates, treeOverlays} from './tree-markers.js';

import {ATHENS, DEFAULT_ZOOM} from './constants/map-constants.js';

import {MDL_NOTIFICATION, MDL_NOTIFICATION_NO_DISMISS} from './constants/modal-types.js';



import { connect }          from 'react-redux';
import {clearModal
      , updateMouseCoords
      , displayModal
      , unsetOrFetch
      , getRegions}  from './redux/actions/index.js';

import {selectedRegions} from './redux/selectors/index.js';


import TreeCountStatistic from './tree-count-statistic.js';


import {targetIsDirty} from './redux/selectors.js';

const mapStateToProps = (state) => {
  if ((state.target.treeInfo != null) && (state.target.treeInfo.original != null)) {
    assert.isOk(state.target.treeInfo.current);
  }
  return {
    targetId          : state.targetId
    , selectedRegions : selectedRegions(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  const pleaseWaitWhileAppIsLoading    = <span>please wait while fetching map data &hellip; </span>;
  return {
    pleaseWaitWhileAppIsLoading: (uuid)=>dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: pleaseWaitWhileAppIsLoading, uuid}))
    , clearModal: (uuid)=> dispatch(clearModal(uuid))
    , updateCoordinates                 : (latlng)   => dispatch(updateMouseCoords(latlng))
    , getRegions: ()=>dispatch(getRegions())
  };
};


// https://spatialreference.org/ref/epsg/2100/
proj4.defs([
  [
    'EPSG:2100',
    '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs']
]);
const WGS84  = 'EPSG:4326';
const HGRS87 = 'EPSG:2100';

class RegionMgmntMap extends React.Component {

  constructor(props) {
    super(props);
    this.layerGroup = null;
    this.clickableLayers = [];
  }

  getMapHeight = () => {
    return this.props.geometryContext.screen.height - this.props.geometryContext.geometry.headerBarHeight
  }




  componentWillUnmount = () => {
    window.removeEventListener ('resize', this.handleResize);
    this.map.off('click');
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
  

  componentDidUpdate = () => {


  }

  componentDidMount = () => {
    const uuid = uuidv4();
    this.props.pleaseWaitWhileAppIsLoading(uuid);

    window.addEventListener    ('resize', this.handleResize);
    this.map = L.map('map-id', {
      center: ATHENS,
      zoom: DEFAULT_ZOOM,
      zoomControl: false
    });

    this.map.doubleClickZoom.disable();

    this.addMeasureControl();
    this.addLayerGroupsExceptPromisingLayers();
    this.addLayerGroupsForPromisingLayers();
    this.addDrawControl();

    this.map.on('draw:created', (e) => this.onDrawCreation(e));

    
    this.map.on('mousemove', (e) => {
      this.props.updateCoordinates(e.latlng);
    })


    $('div.leaflet-control-container section.leaflet-control-layers-list div.leaflet-control-layers-overlays input.leaflet-control-layers-selector[type="checkbox"]').on('change', (e)=>{
    });
    setTimeout(()=>{this.props.clearModal(uuid)}, 1000); // this is dog shit; I shall have to re-implement this properly.
    this.props.getRegions();
  }

  

  addMeasureControl = () => {
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
  }

  addDrawControl = () => {
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);
//    this.layersControl.addOverlay(drawnItems, 'oρισμός περιοχών');
    this.drawControl = new L.Control.Draw({
      draw: {
        polyline: false,
        circlemarker: false, // GeoJSON does not support circles
        circle: false,       // --------------------------------
        rectangle: true,
        marker: false,
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


  addLayerGroupsExceptPromisingLayers = () => {
    const overlays = {};
    overlays['Καλλικράτης'] = ota_Callicrates;
    this.layersControl = L.control.layers(BaseLayersForLayerControl, overlays).addTo(this.map);
    BaseLayersForLayerControl.ESRI.addTo(this.map);
  }


  onDrawCreation = (e) => {
    const type = e.layerType,
          layer = e.layer;
    this.map.addLayer(layer);
    this.drawnItems.addLayer(layer);
    console.warn(layer.toGeoJSON(7));
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
      window.setTimeout(()=>layer.closePopup(), 5000);
    }
  }
  
  addLayerGroupsForPromisingLayers = () => {
    // sse-1587477558
    const treesConfigurationIsNowAvailable = new Promise(
      (resolution, rejection) => {
        const testAvailability = () => {
          if (this.props.treesConfigurationContext.treesConfiguration!=null) {
            console.log('treeConfiguration is now available');
            clearInterval(intervalId);
            resolution();
          } else {
          console.log('treeConfiguration is not yet available');
            ; // wait some more (it typically takes 5 ms to populate the treesConfiguration structure)
          }
        }
        const intervalId = setInterval(testAvailability, 100);
      });
    
    treesConfigurationIsNowAvailable.then( ()=> {
      const promise = treeOverlays(this.props.treesConfigurationContext.treesConfiguration);
      promise.then(({overlays}) => {
        for (const layerName in overlays) {
          const layerGroup = overlays[layerName];
          layerGroup.addTo(this.map);
          this.clickableLayers.push(layerGroup);

          layerGroup.eachLayer ( (marker)=>{
            marker.options.interactive = false; // https://stackoverflow.com/a/60642381/274677
          });
            
          this.layersControl.addOverlay(layerGroup, layerName);
        }
      }).catch( (v) => {
        assert.fail('000 - not expecting this promise to fail: '+v); 
      });
    }).catch( (v) => {
      assert.fail('001 - not expecting this promise to fail: '+v); 
    } );
  }






  render() {
    const style = {height: `${this.getMapHeight()}px`};
    return (
      <div id='map-id' style={style}>
      </div>
    );
  }




}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(RegionMgmntMap));

