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
import {INSERT_GEOJSON_INTO_WORKSPACE}         from './constants/flags.js';
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
    insertOverlay: (geoJSON) => {
      dispatch(clearModal());
      dispatch(setFlag(INSERT_GEOJSON_INTO_WORKSPACE, geoJSON));
    }
  };
}

class ModalInsertGeoJSONToWorkspace extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.overlaySelectionRef = React.createRef();
    this.state = {workspaces: []};
  }

  getGeoJSON = (overlayName) => {
    for (let i = 0 ; i < this.state.workspaces.length ; i++) {
      if (this.state.workspaces[i].name === overlayName)
        return this.state.workspaces[i].geoJSON;
      }
    assert.fail("this should never occur according to design unless you cleared "+
                "your browser's local storage after the modal dialog was displayed "+
                "(in which case you 're an asshole)");
  }

  componentDidMount() {
    const workspaces = ((workspacesJSON)=>{
      if (workspacesJSON===null)
        return [];
      else
        return JSON.parse(workspacesJSON);
    })(localStorage.getItem('workspaces'));
    this.setState({workspaces});
    const domElem = this.ref.current;    
    domElem.showModal();
  }

  insertOverlay = (ev) => {
    ev.preventDefault();
    const overlayName    = this.overlaySelectionRef.current.value;
    const overlayGeoJSON = this.getGeoJSON(overlayName);
    console.log('overlayGeoJSON', overlayGeoJSON);
    this.props.insertOverlay(overlayGeoJSON);
  }


  render() {
    const overlayNames = this.state.workspaces.map( (x)=>x.name );
    console.log('overlayNames');
    console.log(overlayNames);
    const overlayOptions = overlayNames.map( (x) => {
      return <option key={x} value={x}>{x}</option>;
    });
    return (
      <>
      <dialog id="dialog" ref={this.ref}>
        <form method="dialog" onSubmit={this.insertOverlay}>
          <p>Choose an overlay to insert</p>
          <label htmlFor='overlay-select'>Overlay to insert</label>
          <select ref={this.overlaySelectionRef} name="overlay" id="overlay-select">
            <option key='header' value="">--Please choose an option--</option>
            {overlayOptions}
          </select>
          <input type="submit" value="OK"/>          
        </form>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalInsertGeoJSONToWorkspace));


