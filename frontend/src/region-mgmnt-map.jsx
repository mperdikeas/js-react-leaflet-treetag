/* TODO:
 *
 * Check how to customize the polygon editor
 *
 * https://www.wrld3d.com/wrld.js/latest/docs/examples/polygon-editor/
 *
 */




require('./ots/leaflet-heat.js');

require('@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css');
require('@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.js');



window.shp=require('shpjs');
require('./ots/leaflet.shpfile.js');


const React = require('react');
var      cx = require('classnames');

import chai from './util/chai-util';
const assert = chai.assert;

import L from 'leaflet';

import {stringify} from 'wellknown'; // TODO: at some point I will need to do everything in either wellknown or Wicket; currently I am using both (which is a sorry state of affairs)

assert.isOk(stringify);

import 'leaflet/dist/leaflet.css';


import './ots/wise-leaflet-pip.js';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
//import '../node_modules/leaflet-draw/dist/leaflet.draw.js';

import proj4 from 'proj4';

import keycode from 'keycode';

import Wkt from 'wicket';

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

import {RGE_MODE} from './redux/constants/region-editing-mode.js'

import { connect }          from 'react-redux';
import {clearModal
      , updateMouseCoords
      , displayModal
      , unsetOrFetch
      , getRegions
      , setWktRegionUnderConstruction
      , displayModalNotification
      , rgmgmntDeleteStart
      , rgmgmntDeleteEnd}  from './redux/actions/index.js';






import {selectedRegions
      , wktRegionUnderConstructionExists
} from './redux/selectors/index.js';


import TreeCountStatistic from './tree-count-statistic.js';


import {rgeMode} from './redux/selectors/index.js';


import {regionListDiff} from './region-mgmnt-map-util.js';

require('./region-mgmnt-map.css');

const mapStateToProps = (state) => {
  return {
    selectedRegions : selectedRegions(state)
    , rgeMode: rgeMode(state)
    , wktRegionUnderConstructionExists: wktRegionUnderConstructionExists(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  const pleaseWaitWhileAppIsLoading    = <span>please wait while fetching map data &hellip; </span>;
  const aRegionHasAlredyBeenDefined = <span>a region has already been defined! you can't define more than one</span>;
  return {
    pleaseWaitWhileAppIsLoading: (uuid)=>dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: pleaseWaitWhileAppIsLoading, uuid}))
    , aRegionHasAlredyBeenDefined: ()=>dispatch(displayModalNotification({html: aRegionHasAlredyBeenDefined}))
    , clearModal: (uuid)=> dispatch(clearModal(uuid))
    , updateCoordinates                 : (latlng)   => dispatch(updateMouseCoords(latlng))
    , getRegions: ()=>dispatch(getRegions())
    , setWktRegionUnderConstruction: (wkt) => dispatch(setWktRegionUnderConstruction(wkt))
    , rgmgmntDeleteStart: ()=>dispatch(rgmgmntDeleteStart())
    , rgmgmntDeleteEnd: ()=>dispatch(rgmgmntDeleteEnd())
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
    this.wkt = new Wkt.Wkt();
    this.regions = new Map();
    globalSet(GSN.REACT_RGM_MAP, this);
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

  clearDrawnRegions = () => {
    assert.isOk(this.drawnItems);
    this.drawnItems.clearLayers();
  }
  

  componentDidUpdate = (prevProps, prevState) => {
    if ((prevProps.rgeMode !== RGE_MODE.CREATING) && (this.props.rgeMode === RGE_MODE.CREATING))
      this.addDrawControl();
    else if ((prevProps.rgeMode === RGE_MODE.CREATING) && (this.props.rgeMode !== RGE_MODE.CREATING)) {
      console.log(`XXX about to remove draw control, mode is: ${this.props.rgeMode}`);
      this.removeDrawControl();
    }
    const {regionsAdded, regionsRemoved} = regionListDiff(prevProps.selectedRegions, this.props.selectedRegions);
    regionsAdded.forEach( (regionAdded) => {
      const {key, name, wkt} = regionAdded;
      this.addRegionToMap(key, name, wkt);
    });

    regionsRemoved.forEach( (regionRemoved) => {
      const {key, name, wkt} = regionRemoved;
      this.removeRegionFromMap(key, name, wkt);
    });    
  }

  addRegionToMap(key, name, wkt) {
    assert.isOk(name);
    assert.isOk(wkt);
    assert.isOk(key);
    if (false)
      console.log(`region with key: '${key}', name: '${name}' and WKT: '${wkt}' is to be added`);
    this.wkt.read(wkt);
    const geometry = this.wkt.toJson();
    const layer = gsonLayerFromGeometry(name, geometry);
    layer.addTo(this.map);
    this.regions.set(key, layer);
  }

  removeRegionFromMap(key, name, wkt) {
    // TODO: is there a way to make use of the name and wtc values?
    assert.isOk(name);
    assert.isOk(wkt);
    assert.isOk(key);
    if (false)
      console.log(`region with key: '${key}', name: '${name}' and WKT: '${wkt}' is to be removed`);
    assert.isTrue(this.regions.has(key));
    this.regions.get(key).removeFrom(this.map);
    this.regions.delete(key);
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

    this.map.on(L.Draw.Event.CREATED     , (e) => this.onDrawCreation(e));
    this.map.on(L.Draw.Event.DELETED     , (e) => this.onDrawDeleted(e));    
    this.map.on(L.Draw.Event.DELETESTART , (e) => this.onDrawDeleteStart(e));
    this.map.on(L.Draw.Event.DELETESTOP  , (e) => this.onDrawDeleteEnd(e));

    
    this.map.on('mousemove', (e) => {
      this.props.updateCoordinates(e.latlng);
    })


    $('div.leaflet-control-container section.leaflet-control-layers-list div.leaflet-control-layers-overlays input.leaflet-control-layers-selector[type="checkbox"]').on('change', (e)=>{
    });
    setTimeout(()=>{this.props.clearModal(uuid)}, 1000); // this is dog shit; I shall have to re-implement this properly.
    this.props.getRegions();
  }


  onDrawDeleteStart = (e) => {
    assert.strictEqual(this.props.rgeMode, RGE_MODE.CREATING, `region-mgmnt-map.jsx::onDrawDeleteStart mode was ${this.props.rgeMode}`);
    assert.isTrue(this.props.wktRegionUnderConstructionExists);
    this.props.rgmgmntDeleteStart();
  }

  onDrawDeleted = (e) => {
    assert.strictEqual(this.props.rgeMode, RGE_MODE.CREATING, `region-mgmnt-map.jsx::onDrawDeleteEnd mode was ${this.props.rgeMode}`);
    assert.isTrue(this.props.wktRegionUnderConstructionExists);
    console.log(e);
    this.clearDrawnRegions();
    this.props.setWktRegionUnderConstruction(null);
  }

  onDrawDeleteEnd = (e) => {
    console.log('33333333333333333333');
    assert.strictEqual(this.props.rgeMode, RGE_MODE.CREATING, `region-mgmnt-map.jsx::onDrawDeleteEnd mode was ${this.props.rgeMode}`);
    console.log(e);
    this.props.rgmgmntDeleteEnd();
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
    assert.isFalse(this.hasOwnProperty('drawnItems'));
    assert.isFalse(this.hasOwnProperty('drawControl'));
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

  removeDrawControl = () => {
    console.log('XXX removing daw control');
    assert.isOk(this.drawControl);
    assert.isOk(this.drawnItems);
    this.map.removeControl(this.drawControl);
    this.map.removeLayer(this.drawnItems);
    delete this.drawControl;
    delete this.drawnItems;
  }


  addLayerGroupsExceptPromisingLayers = () => {
    const overlays = {};
    overlays['Καλλικράτης'] = ota_Callicrates;
    this.layersControl = L.control.layers(BaseLayersForLayerControl, overlays).addTo(this.map);
    BaseLayersForLayerControl.ESRI.addTo(this.map);
  }



  onDrawCreation = (e) => {
    assert.strictEqual(this.props.rgeMode, RGE_MODE.CREATING, `region-mgmnt-map.jsx::onDrawCreation mode was ${this.props.rgeMode}`);
    if (this.props.wktRegionUnderConstructionExists) {
      this.props.aRegionHasAlredyBeenDefined();
    } else {
      const type = e.layerType,
            layer = e.layer;
      //    this.map.addLayer(layer); // TODO: I used to have that but I don't think it's needed
      this.drawnItems.addLayer(layer);
      console.warn(layer.toGeoJSON(7));


      this.props.setWktRegionUnderConstruction(stringify(layer.toGeoJSON(12)));

      assert.isTrue(layer instanceof L.Polygon, `region-mgmnt-map.jsx::onDrawCreation layer is not a polygon`);

      console.log(`area is ${L.GeometryUtil.geodesicArea(layer.getLatLngs())}`);
      const countResult = this.countTreesInLayer(layer);
      const treesConfiguration = this.props.treesConfigurationContext.treesConfiguration;
      assert.exists(treesConfiguration, ABOMINATION_MSG);
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

function gsonLayerFromGeometry(name, geometry) {
  const properties =  {name, popupContent:name};
  const geoJson =  { type: 'Feature', properties, geometry};

  const style = {
    color: "#ff7800",
    weight: 3,
    opacity: 0.40,
    fillOpacity: 0.40
  };
  const onEachFeature = (feature, layer) => {
    layer.on('mouseover', function () {
      this.setStyle({
        weight: 7
        , opacity: 1
        , fillOpacity: 0.60
      });
    });
    layer.on('mouseout', function () {
      this.setStyle({
        weight: 3
        , opacity: 0.40
        , fillOpacity: 0.40
      });
    });
    layer.on('click', function () {
      console.log('clicked on some layer');
    });
    const popupOptions = {
      closeButton: true // TODO: I believe this is not working
      , autoClose: true // TODO: I believe this is not working
      , closeOnEscapeKey: true
    };
    layer.bindPopup(`<h4>${feature.properties.name}</h4><p>${feature.properties.popupContent}</p>`, popupOptions);
  };

  const options = {style, onEachFeature};
  const layer = L.geoJSON(geoJson, options);
  layer.bindTooltip(
    name,
    {
      permanent:false,
      direction:'center',
      className: 'region-mgmnt-region'
    });
  return layer;
  }


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(RegionMgmntMap));

      const ABOMINATION_MSG = 'it is inconceivable that, at this point, the TreesConfigurationContextProvider'
                             +' should have failed to obtain the treesConfiguration object. If this abomination should come'
                             +' to transpire then an approach similar to that used in ref:sse-1587477558 should be adopted.'
                             +' However, given that it is highly unlikely that this should ever come to pass, I consider'
                             +' it an overkill to adopt such an approach pre-emptively. In constrast, the approach in'
                             +' ref:sse-1587477558 was, in fact, necessary';
