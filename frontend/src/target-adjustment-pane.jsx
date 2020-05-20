const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import {Form, Col, Row, Button, Nav, ButtonGroup} from 'react-bootstrap';

// REDUX
import { connect }          from 'react-redux';

import {axiosAuth} from './axios-setup.js';

import L from 'leaflet';
import {Athens} from './tree-markers.js';

import {possiblyInsufPrivPanicInAnyCase, isInsufficientPrivilleges} from './util-privilleges.js';

import {MODAL_LOGIN, MDL_NOTIFICATION} from './constants/modal-types.js';
import {displayModal, setTreeCoords, revertTreeCoords} from './actions/index.js';

import wrapContexts from './context/contexts-wrapper.jsx';

import {ATHENS, DEFAULT_ZOOM} from './constants/map-constants.js';

import {GSN, globalGet} from './globalStore.js';

import {addPopup} from './leaflet-util.js';

import {haversineGreatCircleDistance, latitudeToMeters, longitudeToMeters} from './geodesy.js';

const mapStateToProps = (state) => {
  return {
    targetId: state.targetId
  };
};

const mapDispatchToProps = (dispatch) => {
  const msgInsufPriv1 = 'ο χρήστης δεν έχει τα προνόμια για να εκτελέσει αυτήν την λειτουργία';
  const msgTreeDataHasBeenUpdated = targetId => `τα νέα δεδομένα για το δένδρο #${targetId} αποθηκεύτηκαν`;
  return {
    displayModalLogin: (func)  => dispatch(displayModal(MODAL_LOGIN, {followUpFunction: func}))
    , displayNotificationInsufPrivilleges: ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgInsufPriv1}))
    , displayTreeDataHasBeenUpdated: (targetId)=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataHasBeenUpdated(targetId)})) // TODO: what to do with this ?
    , setTreeCoords: ({lat, lng}) => dispatch(setTreeCoords({longitude: lng, latitude: lat}))
    , revertTreeCoords: ()=>dispatch(revertTreeCoords())
  };
}






class TargetAdjustmentPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.initialState();
  }

  initialState = () => {
    const latlng = this.initialLatLngOfMarker();
    return {savingTreeData: false, latlng};
  }

  initialLatLngOfMarker = () => {
    const targetId = this.props.targetId;
    const markerInMainMap = this.targetId2Marker(targetId);
    return markerInMainMap.getLatLng();
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

  clearMovableMarker = () => {
    let i = 0;
    this.map.eachLayer( (layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
        i ++;
      }
    });
    assert.isAtMost(i, 1);
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
      this.setState({latlng: e.target.getLatLng()});
      this.props.setTreeCoords(e.target.getLatLng()); // maybe I should keep reading the current latlng from props.treeInfo.current.coords and remove the local state
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
      this.setState(this.initialState());
    }
  }

  markerHasBeenDisplaced = () => {
    return (this.state.latlng !== this.initialLatLngOfMarker());
  }

  revert = () => {
    assert.isOk(this.polyline);
    this.map.removeLayer(this.polyline);
    this.addMovableMarker();
    this.setState(this.initialState());
    this.props.revertTreeCoords();
  }

  render() {
    const initialLatLng = this.initialLatLngOfMarker();
    const deltaLat = initialLatLng.lat - this.state.latlng.lat;
    const deltaLng = initialLatLng.lng - this.state.latlng.lng;
    return (
      <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div id='target-adjustment-map' style={{width: '90%', marginLeft: '5%', height: '350px'}}>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
          <span>Δx: {latitudeToMeters(deltaLat, initialLatLng.lat).toFixed(3)}m</span>
          <span>Δy: {longitudeToMeters(deltaLng, initialLatLng.lng).toFixed(3)}m</span>
        </div>
        <div style={{textAlign: 'center'}}>
Απόσταση: {haversineGreatCircleDistance(initialLatLng.lat, initialLatLng.lng, this.state.latlng.lat, this.state.latlng.lng).toFixed(3)}m
        </div>
          <ButtonGroup style={{marginTop: '1em'
                             , display: 'flex'
                             , flexDirection: 'row'
                             , justifyContent: 'space-around'}}className="mb-2">
            <Button disabled={! this.markerHasBeenDisplaced()} style={{flexGrow: 0}} variant="secondary" onClick={this.revert}>
              Ανάκληση
            </Button>
            <Button disabled={! this.markerHasBeenDisplaced} style={{flexGrow: 0}} variant="primary" type="submit">
              {this.state.savingTreeData?'Σε εξέλιξη...':'Αποθήκευση'}
            </Button>
          </ButtonGroup>
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(TargetAdjustmentPane));


