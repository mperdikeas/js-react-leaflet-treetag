const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { dismissToast } from './actions/index.js';

import {Toast} from 'react-bootstrap';

import { isSubsetOf } from 'is-subset-of';

require('./css/toast.css');

import time_from_now from './time-from-now.js';


export default class ToastWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.ageRef = React.createRef();
  }

  componentDidMount = () => {
    this.timeMounted = new Date();
    this.ageUpdateInterval = setInterval(this.updateTime, 5000);
  }

  updateTime = ()=>{
    this.ageRef.current.innerHTML = time_from_now(this.timeMounted);
  }

  componentWillUnmount = () => {
    clearInterval(this.ageUpdateInterval);
  }


  render() {
    const toastStyle={
      backgroundColor: '#A4FE82'
    };

    return (
      <Toast style={toastStyle}
             show={this.props.show}
             onClose={this.props.onClose}
             animation={true}
             delay={5*60*1000}
             autohide={true}>
        <Toast.Header>
          <strong className="mr-auto">{this.props.header}</strong>
          <small ref={this.ageRef}>just now</small>
        </Toast.Header>
        <Toast.Body>{this.props.msg}</Toast.Body>
      </Toast>
    );
  }
}
