const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import {Form, Col, Row, Button, Nav, ButtonGroup} from 'react-bootstrap';

// REDUX
import { connect }          from 'react-redux';

import L from 'leaflet';
import {Athens} from './tree-markers.js';

import {possiblyInsufPrivPanicInAnyCase, isInsufficientPrivilleges} from './util-privilleges.js';

import {MDL_NOTIFICATION} from './constants/modal-types.js';
import {displayModal, setTreeCoords, revertTreeCoords} from './redux/actions/index.js';

import saveFeatureData from './redux/actions/save-feature-data.jsx';

import wrapContexts from './context/contexts-wrapper.jsx';

import {ATHENS, DEFAULT_ZOOM} from './constants/map-constants.js';

import {GSN, TARG_ADJ_PANE, globalGet, globalSet} from './globalStore.js';

import {addPopup} from './leaflet-util.js';

import {haversineGreatCircleDistance, latitudeToMeters, longitudeToMeters} from './geodesy.js';

const mapStateToProps = (state) => {
  console.log(state.target.treeInfo.original);
  console.log(state.target.treeInfo.current);
  const markerHasBeenDisplaced = (JSON.stringify(state.target.treeInfo.current.coords) !== JSON.stringify(state.target.treeInfo.original.coords));
  return {
    targetId: state.target.id
    , treeInfo: state.target.treeInfo.current
    , markerHasBeenDisplaced
    , originalLatLng: state.target.treeInfo.original.coords
    , currentLatLng: state.target.treeInfo.current.coords
  };
};

const mapDispatchToProps = (dispatch) => {
  const msgInsufPriv1 = 'ο χρήστης δεν έχει τα προνόμια για να εκτελέσει αυτήν την λειτουργία';
  const msgTreeDataHasBeenUpdated = targetId => `τα νέα δεδομένα για το δένδρο #${targetId} αποθηκεύτηκαν`;
  return {
    saveFeatureData: (treeInfo) => dispatch(saveFeatureData(treeInfo))
    , displayModalLogin: (func)  => dispatch(displayModal(MODAL_LOGIN, {followUpFunction: func}))
    , displayNotificationInsufPrivilleges: ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgInsufPriv1}))
    , displayTreeDataHasBeenUpdated: (targetId)=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataHasBeenUpdated(targetId)})) // TODO: what to do with this ?
    , setTreeCoords: ({lat, lng}) => dispatch(setTreeCoords({longitude: lng, latitude: lat}))
    , revertTreeCoords: ()=>dispatch(revertTreeCoords())
  };
}






class TargetAdjustmentPane extends React.Component {

  constructor(props) {
    super(props);
    globalSet(GSN.TARG_ADJ_PANE, this);
  }


  initialLatLngOfMarker = () => {
    const targetId = this.props.targetId;
    const markerInMainMap = this.targetId2Marker(targetId);

    const {lat, lng} = markerInMainMap.getLatLng();
    const {latitude, longitude} = this.props.originalLatLng;
    assert.strictEqual(lat, latitude);
    assert.strictEqual(lng, longitude);
    
    return {lat, lng}
    
  }

  componentDidMount = () => {
    this.map = L.map('target-adjustment-map', {
      center: this.initialLatLngOfMarker(),
      zoom: DEFAULT_ZOOM+3,     
      minZoom: DEFAULT_ZOOM+3,  // effectively disables zoom out
      zoomControl: false,
      dragging: true
    });


    const baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      detectRetina: true,
      maxZoom: 50
    });
    baseLayer.addTo(this.map);
    this.addMovableMarker();
    this.addNeighbouringMarkers();
  }



  clearNeighbouringMarkers = () => {
    this.map.eachLayer( (layer) => {
      if (layer instanceof L.CircleMarker)
        this.map.removeLayer(layer);
    });
  }


  /*
   * The movable marker that marks the spot of the tree is
   * the only layer in the target adjustment pane that's of
   * type 'L.marker'
   */
  getMovableMarker = (tolerateNoneFound) => {
    let i = 0;
    let rv = null;
    this.map.eachLayer( (layer) => {
      if (layer instanceof L.Marker) {
        rv = layer;
        i ++;
      }
    });
    if (tolerateNoneFound)
      assert.isAtMost(i, 1);
    else
      assert.strictEqual(i, 1);
    return rv;
  }

  clearMovableMarker = () => {
    const marker = this.getMovableMarker(true);
    if (marker !== null)
        this.map.removeLayer(marker);
  }

  adjustMovableMarker = (latlng) => {
    const marker = this.getMovableMarker(false);
    marker.setLatLng(latlng);
    if (this.polyline)
      this.map.removeLayer(this.polyline);
  }

  addMovableMarker = () => {
    this.clearMovableMarker()
    const treeConfig = this.props.treesConfigurationContext.treesConfiguration;
    
    const markerInMainMap = this.targetId2Marker(this.props.targetId);
    const marker = new L.marker(markerInMainMap.getLatLng()
                              , {radius: 8
                               , autoPan: false // only small size adjustments are foreseen
                               , draggable: 'true'});
    addPopup(marker, treeConfig[markerInMainMap.options.kind].name.singular);

    marker.on('drag', (e) => {
      console.log('marker drag event');
      const latlngs = [this.initialLatLngOfMarker(), e.target.getLatLng()];
      this.map.removeLayer(this.polyline);
      this.polyline = L.polyline(latlngs, {color: 'red'}).addTo(this.map);
      this.props.setTreeCoords(e.target.getLatLng());
    });
    marker.on('dragstart', (e) => {
      if (this.polyline)
        this.map.removeLayer(this.polyline);
      const latlngs = [this.initialLatLngOfMarker(), e.target.getLatLng()];
      this.polyline = L.polyline(latlngs, {color: 'red'}).addTo(this.map);
      console.log(`marker drag event START coords are ${e.target.getLatLng()}`);
    });
    marker.on('dragend', (e) => {
      console.log(`marker drag event END coords are ${e.target.getLatLng()}`);
    });
    
    this.map.addLayer(marker)
  }

  addNeighbouringMarkers = () => {
    this.clearNeighbouringMarkers();
    const treeConfig = this.props.treesConfigurationContext.treesConfiguration;
    const origMapReactComponent = globalGet(GSN.REACT_MAP);
    const markersInfo = origMapReactComponent.getInfoOfMarkersInBounds(this.map.getBounds()
                                                                     , this.props.targetId);
    markersInfo.forEach(({latlng, kind}) => {

      const marker = L.circleMarker(latlng
                                  , {radius: 8
                                   , autoPan: false
                                   , color: treeConfig[kind].color});
      addPopup(marker, treeConfig[kind].name.singular)
      this.map.addLayer(marker)
    });
  }

  addMarkers = () => {
    this.addMovableMarker();
    this.addNeighbouringMarkers();
  }

  targetId2Marker = (targetId) => {
    return globalGet(GSN.REACT_MAP).id2marker[targetId];
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.targetId !== this.props.targetId) {
      /*
      console.log('cancelling pending requests due to new target');
      this.source.cancel(OP_NO_LONGER_RELEVANT);
      this.source = CancelToken.source(); // cf. SSE-1589117399
      this.fetchData();
       */

      this.map.panTo(this.initialLatLngOfMarker(), {animate: true, duration: .5} );
      this.map.on('moveend', () => {
        /* addMarkers() can only be called once the pan has ended otherwise the
         * boundary of the map won't be computed correctly
         */
        this.addMarkers();
      });
    }
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.saveFeatureData(this.props.treeInfo);
  }

  revert = () => {
    assert.isOk(this.polyline);
    this.map.removeLayer(this.polyline);
    this.addMovableMarker();
    this.props.revertTreeCoords();
  }

  render() {
    console.warn('abc-render');
    const initialLatLng = this.initialLatLngOfMarker();
    console.warn('abc-render - NED');
    const {latitude: lat, longitude: lng} = this.props.currentLatLng;
    const deltaLat = initialLatLng.lat - lat;
    const deltaLng = initialLatLng.lng - lng;
    return (
      <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div id='target-adjustment-map' style={{width: '90%', marginLeft: '5%', height: '350px'}}>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
          <span>Δx: {latitudeToMeters(deltaLat, initialLatLng.lat).toFixed(3)}m</span>
          <span>Δy: {longitudeToMeters(deltaLng, initialLatLng.lng).toFixed(3)}m</span>
        </div>
        <div style={{textAlign: 'center'}}>
Απόσταση: {haversineGreatCircleDistance(initialLatLng.lat, initialLatLng.lng, lat, lng).toFixed(3)}m
        </div>
          <ButtonGroup style={{marginTop: '1em'
                             , display: 'flex'
                             , flexDirection: 'row'
                             , justifyContent: 'space-around'}}className="mb-2">
            <Button disabled={! this.props.markerHasBeenDisplaced} style={{flexGrow: 0}} variant="secondary" onClick={this.revert}>
              Ανάκληση
            </Button>
            <Button disabled={! this.props.markerHasBeenDisplaced} style={{flexGrow: 0}} variant="primary" onClick={this.handleSubmit}>
              {'Αποθήκευση'}
            </Button>
          </ButtonGroup>
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(TargetAdjustmentPane));


