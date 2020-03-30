const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

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
    const domElem = this.ref.current;
    domElem.showModal();
  }

  saveOverlay = (ev) => {
    ev.preventDefault();    
    const overlayName = this.overlayNameRef.current.value;
    const workspacesJSON = localStorage.getItem('workspaces');
    const workspaces = ((workspacesJSON)=>{
      if (workspacesJSON===null)
        return [];
      else
        return JSON.parse(workspacesJSON);
    })(workspacesJSON);
    workspaces.push({name: overlayName
                   , geoJSON: this.props.geoJSON});
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
    console.log(`overlay with name [${overlayName}] is now saved; ${workspaces.length} workspaces in local storage`);
    this.props.overlayIsNowSaved();
  }


  render() {
    return (
      <>
      <dialog id="dialog" ref={this.ref}>
        <form method="dialog" onSubmit={this.saveOverlay}>
          <p>Enter a name for this overlay</p>
          <label htmlFor='overlay-name-input'>Name for the overlay</label>
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


