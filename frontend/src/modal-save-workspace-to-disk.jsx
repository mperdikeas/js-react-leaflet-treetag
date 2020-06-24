const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.tsx';

import {  connect   }              from 'react-redux';
import { clearModal, addToast } from './redux/actions/index.js';


import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

import {globalGet, GSN} from './globalStore.js';



import { saveAs } from 'file-saver';

const mapDispatchToProps = (dispatch) => {
  return {
    clearModal: ()=>dispatch(clearModal())
    , overlayIsNowSaved: (fname, wipeWSAfterSave) => {
      dispatch(clearModal());
      if (wipeWSAfterSave)
        globalGet(GSN.REACT_MAP).drawnItems.clearLayers();
      
      dispatch(addToast('overlay saved', `current overlay was saved to disk using suggested filename '${fname}'.`
        +' Exact filename and directory are decided by the browser automatically.'
        +(wipeWSAfterSave===false?'':' Workspace is now wiped clean and empty again.')));
    }
  };
}

class ModalSaveWorkspaceToDisk extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.ref = React.createRef();
    this.overlayFnameInputRef = React.createRef();
    this.cleanWSCheck = React.createRef();
    this.state = {validated: false};
  }

  componentDidMount() {
    const domElem = this.ref.current;
    domElem.showModal();
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    assert.isNotNull(event); // TODO: investigate this aberration
    assert.isDefined(event); // ---------------------------------
    const form = ev.currentTarget;
    if (form.checkValidity() === true) {
      const fname = this.overlayFnameInputRef.current.value;
      const wipeWSAfterSave = this.cleanWSCheck.current.checked;

      const blob = new Blob([JSON.stringify(this.props.geoJSON)], {type: "application/geo+json;charset=utf-8"});
      saveAs(blob, fname);
      this.props.overlayIsNowSaved(fname, wipeWSAfterSave);
    }
    this.setState({validated: true});
  }


  render() {
    return (
      <>
      <dialog id="dialog" ref={this.ref}>

        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div>Save the present workspace overlay to disk.</div>
            <div style={{marginBottom: '1em'}}>Please enter the filename to save it under:</div>
            <Form.Group as={Col} controlId="overlay">
              <Form.Control required
                            ref={this.overlayFnameInputRef}
                            type="text"
                            placeholder="workspace.json"
              />
              <Form.Control.Feedback>
                Looks good!
              </Form.Control.Feedback>              
              <Form.Control.Feedback type="invalid">
                υποχρεωτικό πεδίο
              </Form.Control.Feedback>              
            </Form.Group>
            <Form.Group>
              <Form.Check label="Wipe clean workspace after successful save"
                          ref={this.cleanWSCheck}
              />
            </Form.Group>
            <div style={{display: 'flex'
                       , flexDirection:'row'
                       , justifyContent: 'space-around'}}>
              <Button variant="secondary" onClick={this.props.clearModal}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </div>
        </Form>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(null, mapDispatchToProps)(wrapContexts(ModalSaveWorkspaceToDisk));


