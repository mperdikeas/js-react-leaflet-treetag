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
import {CLEAR_DRAW_WORKSPACE}                  from './constants/flags.js';
import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { clearModal, setFlag } from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    modal: state.modal.modalProps
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    overlayIsNowSaved: () => {
      dispatch(clearModal());
      dispatch(setFlag(CLEAR_DRAW_WORKSPACE));
    }
  };
}

class ModalSaveWorkspaceToDisk extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.ref = React.createRef();
    this.overlayNameRef = React.createRef();
  }

  componentDidMount() {
    console.log('ModalAddGeometry::componentDidMount');
    console.log(this.props);
    const domElem = this.ref.current;
    domElem.showModal();
  }

  saveOverlay = (ev) => {
    ev.preventDefault();    
    const overlayName = this.overlayNameRef.current.value;
    localStorage.setItem('workspace', JSON.stringify({name: overlayName
                                                   , geoJSON: this.props.geoJSON}));
    console.log(`overlay with name [${overlayName}] is now saved`);
    this.props.overlayIsNowSaved();
  }


  render() {
    return (
      <>
      <dialog id="dialog" ref={this.ref}>
        <form method="dialog" onSubmit={this.saveOverlay}>
          <p>Enter a name for this overlay</p>
          <label htmlFor='overlay-name-input'>Name for the new geometry</label>
          <input ref={this.overlayNameRef} type='text' id='overlay-name-input'/><br/>
          <input type="submit" value="OK"/>
        </form>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalSaveWorkspaceToDisk));


