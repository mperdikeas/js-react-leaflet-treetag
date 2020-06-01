const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from '../../context/geometry-context.jsx';

import wrapContexts from '../../context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { dismissToast } from '../../redux/actions/index.js';


import Toast from './toast.jsx';

import { isSubsetOf } from 'is-subset-of';

require('./toast.css');

const mapStateToProps = (state) => {
  return {
    toasts: state.toasts

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dismissToast: (id) => dispatch(dismissToast(id))
  };
};


class ToastsStack extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    const toastContainerStyle={position: 'absolute'
                             , top: this.props.geometryContext.topOfToastDiv()
                             , left: this.props.geometryContext.leftOfToastDiv()
                             , width: this.props.geometryContext.geometry.toastDiv.width
                             , zIndex: 99999};

    const toastsDiv = Object.keys(this.props.toasts).map( (key) => {
      const {header, msg} = this.props.toasts[key];
      return (
        <Toast
            key = {key}
            key2 = {key}
            dismissToast={this.props.dismissToast}
            header={header}
            msg={msg}
        />
      );
    });
    return (
      <>
      <div style={toastContainerStyle}>
        {toastsDiv}
      </div>
      {this.props.children}
      </>
    );

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ToastsStack));


