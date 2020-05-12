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

  componentDidMount() {
    const map = L.map('target-adjustment-map', {
      center: Athens,
      zoom: 15,
      zoomControl: false
    });
    this.map = map;
    this.map.setView(Athens, 15);

    const baseLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      detectRetina: true,
      maxZoom: 50
    });
    baseLayer.addTo(this.map);
  }

  render() {
    return (
      <div id='target-adjustment-map' style={{height: '350px'}}>
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(TargetAdjustmentPane));


