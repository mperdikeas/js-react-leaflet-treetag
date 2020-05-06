const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;


const loading  = require('./resources/loading.gif');
// require('../resources/down-arrow.png');
import DownArrow from './resources/down-arrow.png';
// const download = url('../resources/
import {sca_fake_return} from './util.js';


import {axiosAuth} from './axios-setup.js';

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

// REDUX
import { connect } from 'react-redux';

import {MODAL_LOGIN} from './constants/modal-types.js';
import {displayModal} from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    targetId: state.targetId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayModalLogin: (func)  => dispatch(displayModal(MODAL_LOGIN, {followUpFunction: func}))
  };
}




class PhotoDateAndDeletion extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    console.log(this.props.photoBase64Instant);
    const localDate = new Date();
    localDate.setUTCSeconds(this.props.photoBase64Instant);
    const localDateString = localDate.toLocaleDateString('el-GR');
    const divDate = (<div>Λήψη {localDateString}</div>);

    return (
      <div style={{display: 'flex'
                 , flexDirection: 'row'
                 , justifyContent: 'space-around'
                 , marginBottom: '1em'}}>
        <span>λήψη {localDateString}</span>
        <Button variant='outline-danger'>Διαγραφή</Button>
      </div>

    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PhotoDateAndDeletion);
