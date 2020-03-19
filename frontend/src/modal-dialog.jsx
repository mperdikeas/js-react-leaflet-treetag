const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import TilesSelector                           from './tiles-selector.jsx';
import Map                                     from './map.jsx';
import TreeInformationPanel                    from './information-panel-tree.jsx';
import InformationPanelGeometryDefinition      from './information-panel-geometry-definition.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import Toolbox                                 from './toolbox.jsx';
import {SELECT_TREE_TOOL, DEFINE_POLYGON_TOOL} from './map-tools.js';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

class ModalDialog extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.inputGeometryNameRef = React.createRef();
    this.inputUsernameRef     = React.createRef();
    this.inputPasswordRef     = React.createRef();
  }

  componentDidMount() {
    console.log('ModalDialog::componentDidMount');
    if (this.props.modalType==='login') {
      const domElem = this.ref.current;
      domElem.showModal();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.modalType && this.props.modalType) {
      const domElem = this.ref.current;
      domElem.showModal();
    }
  }

  /*
  handleSubmit = (ev) => {
    ev.preventDefault();
    switch (this.props.modalType) {
      case 'geometry-name':

        break;
      default:
        assert.fail(`unrecognized modal type: ${this.props.modalType}`);

    } // switch
  }
*/
  addGeometry = (ev) => {
    ev.preventDefault();    
    const geometryName = this.inputGeometryNameRef.current.value;
    this.props.modalProps.addGeometry(geometryName);
  }

  login = (ev) => {
    ev.preventDefault();
    const username = this.inputUsernameRef.current.value;
    const password = this.inputPasswordRef.current.value;
    this.props.modalProps.login(username, password);
  }

    


  render() {
    switch (this.props.modalType) {

      case 'geometry-name':
        return (
          <>
          <dialog id="dialog" ref={this.ref}>
            <form method="dialog" onSubmit={this.addGeometry}>
              <p>Please enter a name for this new geometry</p>
              <label for='geometry-name-input'>Name for the new geometry</label>
              <input ref={this.inputGeometryNameRef} type='text' id='geometry-name-input'/><br/>
              <input type="submit" value="OK"/>
            </form>
          </dialog>
          {this.props.children}
          </>
        )
      case 'login':
        const logErrMsg = (()=>{
          const msg = this.props.modalProps.logErrMsg
          if (msg)
            return <div style={{color: 'red'}}>{msg}</div>;
          else
            return null;
        })();
        return (
          <>
          <dialog id="dialog" ref={this.ref}>
              <form method="dialog" onSubmit={this.login}>
              {logErrMsg}
              <p>Please provide your username and password</p>
              <label htmlFor='login-name-input'>Username</label>
              <input ref={this.inputUsernameRef} type='text' id='login-name-input'/><br/>
              <label htmlFor='login-pass-input'>Password</label>
              <input ref={this.inputPasswordRef} type='text' id='login-pass-input'/><br/>          
              <input type="submit" value="OK"/>
            </form>
          </dialog>
          {this.props.children}
          </>
          )
      case null:
        return (
          <>
          {this.props.children}
          </>
        )
      default:
        assert.fail(`unrecognized modal type: ${this.props.modalType}`);
    }
  }
}



export default ModalDialog;

