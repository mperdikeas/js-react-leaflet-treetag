const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;


import {Toast as ToastBootSTRP} from 'react-bootstrap';

import { isSubsetOf } from 'is-subset-of';

require('./toast.css');

import time_from_now from './../../util/time-from-now.js';


export default class Toast extends React.PureComponent {

  constructor(props) {
    super(props);
    this.ageRef = React.createRef();
  }

  componentDidMount = () => {
    this.timeMounted = new Date();
    this.ageUpdateInterval = setInterval(this.updateTime, 5000);
    window.setTimeout(this.makeToastVisible, 0);
  }

  updateTime = ()=>{
    this.ageRef.current.innerHTML = time_from_now(this.timeMounted);
  }

  componentWillUnmount = () => {
    clearInterval(this.ageUpdateInterval);
  }

  makeToastVisible = () => {
    this.props.makeToastVisible(this.props.key2);
  }

  dismissToast = () => {
    this.props.dismissToast(this.props.key2);
  }

  render() {
    const toastStyle={
      backgroundColor: '#A4FE82'
    };

    return (
      <ToastBootSTRP style={toastStyle}
             show={this.props.show}
             onClose={this.dismissToast}
             animation={true}
             delay={5*60*1000}
             autohide={true}>
        <ToastBootSTRP.Header>
          <strong className="mr-auto">{this.props.header}</strong>
          <small ref={this.ageRef}>just now</small>
        </ToastBootSTRP.Header>
        <ToastBootSTRP.Body>{this.props.msg}</ToastBootSTRP.Body>
      </ToastBootSTRP>
    );
  }
}
