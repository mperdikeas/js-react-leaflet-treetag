const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import axios from 'axios';
import {setCookie}                             from './util.js';

import {GeometryContext} from './context/geometry-context.jsx';

import TilesSelector                           from './tiles-selector.jsx';
import Map                                     from './map.jsx';
import TreeInformationPanel                    from './information-panel-tree.jsx';
import InformationPanelGeometryDefinition      from './information-panel-geometry-definition.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import Toolbox                                 from './toolbox.jsx';
import {SELECT_TREE_TOOL, DEFINE_POLYGON_TOOL} from './map-tools.js';
import {BASE_URL}                              from './constants.js';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { clearModal, addGeometry } from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    modal: state.modal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addGeometry: (geometryName) => dispatch(addGeometry(geometryName))
    };
}

class ModalAddGeometry extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.inputGeometryNameRef = React.createRef();
  }

  componentDidMount() {
    console.log('ModalAddGeometry::componentDidMount');
    const domElem = this.ref.current;
    domElem.showModal();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.modalType && this.props.modalType) {
      const domElem = this.ref.current;
      domElem.showModal();
    }
  }

  addGeometry = (ev) => {
    ev.preventDefault();    
    const geometryName = this.inputGeometryNameRef.current.value;
    this.props.addGeometry(geometryName);
  }


  render() {
    return (
      <>
      <dialog id="dialog" ref={this.ref}>
        <form method="dialog" onSubmit={this.addGeometry}>
          <p>Please enter a name for this new geometry</p>
          <label htmlFor='geometry-name-input'>Name for the new geometry</label>
          <input ref={this.inputGeometryNameRef} type='text' id='geometry-name-input'/><br/>
          <input type="submit" value="OK"/>
        </form>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalAddGeometry));


