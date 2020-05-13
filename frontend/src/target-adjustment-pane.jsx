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
import {displayModal} from './actions/index.js';

import wrapContexts from './context/contexts-wrapper.jsx';

import {ATHENS, DEFAULT_ZOOM} from './constants/map-constants.js';

import {GSN, globalGet} from './globalStore.js';

import {addPopup} from './leaflet-util.js';

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
    , displayTreeDataHasBeenUpdated: (targetId)=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataHasBeenUpdated(targetId)}))
  };
}






class TargetAdjustmentPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = {savingTreeData: false};
  }

  componentDidMount = () => {
    const targetId = this.props.targetId;
    console.log(targetId);
    const markerInMainMap = this.targetId2Marker(targetId);
    this.map = L.map('target-adjustment-map', {
      center: markerInMainMap.getLatLng(),
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
    this.addMarkers();
  }


  clearMarkers = () => {
    this.map.eachLayer( (layer) => {
      if ((layer instanceof L.Marker) || (layer instanceof L.CircleMarker))
        this.map.removeLayer(layer);
    });
  }

  addMarkers = () => {
    this.clearMarkers();
    const treeConfig = this.props.treesConfigurationContext.treesConfiguration;
    
    const markerInMainMap = this.targetId2Marker(this.props.targetId);
    const marker = new L.marker(markerInMainMap.getLatLng()
                              , {radius: 8
                               , autoPan: false // only small size adjustments are foreseen
                               , draggable: 'true'});
    addPopup(marker, treeConfig[markerInMainMap.options.kind].name.singular);

    
    this.map.addLayer(marker)

    const origMapReactComponent = globalGet(GSN.REACT_MAP);
    const originalMap = origMapReactComponent.map;

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

  targetId2Marker = (targetId) => {
    return globalGet(GSN.REACT_MAP).id2marker[targetId];
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log(`target id is: ${this.props.targetId}`);
    if (prevProps.targetId !== this.props.targetId) {
      /*
      console.log('cancelling pending requests due to new target');
      this.source.cancel(OP_NO_LONGER_RELEVANT);
      this.source = CancelToken.source(); // cf. SSE-1589117399
      this.fetchData();
       */
      const targetId = this.props.targetId;
      const markerInMainMap = this.targetId2Marker(targetId);
      this.map.panTo(markerInMainMap.getLatLng(), {animate: true, duration: .5} );
      this.map.on('moveend', () => {
        /* addMarkers() can only be called once the pan has ended otherwise the
         * boundary of the map won't be computed correctly
         */
        this.addMarkers();
      });
    }
  }
  

  render() {
    return (
      <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div id='target-adjustment-map' style={{width: '90%', marginLeft: '5%', height: '350px'}}>
        </div>
        <div>Δχ: -24m Δυ: -24m
        </div>
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(TargetAdjustmentPane));


