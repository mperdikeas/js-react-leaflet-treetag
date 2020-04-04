const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { clearModal, addGeometry } from './actions/index.js';

import {Toast} from 'react-bootstrap';

const mapStateToProps = (state) => {
  return state;
};

const ToastLayer = ({toasts, children}) => {
  const style={position: 'absolute', top: 0, left: 0, zIndex: 100};
  const toastsDiv = toasts.map( ({id, msg}) => {
    return (
      <Toast show={true} onClose={()=>{console.log('close toast');}}>
        <Toast.Header>
          <strong className="mr-auto">Password change</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Email with confirmation code sent to your addresss of record {msg}</Toast.Body>
      </Toast>
    );
    });
  return (
    <>
    <div style={style}>
      {toastsDiv}
    </div>
      {children}
    </>
  );
}

export default connect(mapStateToProps, null)(wrapContexts(ToastLayer));


