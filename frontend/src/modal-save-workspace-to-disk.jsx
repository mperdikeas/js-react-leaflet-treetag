const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {CLEAR_DRAW_WORKSPACE}                  from './constants/flags.js';
import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { clearModal, setFlag } from './actions/index.js';


import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

import {addToast} from './actions/index.js';


import { saveAs } from 'file-saver';

const mapDispatchToProps = (dispatch) => {
  return {
    clearModal: ()=>dispatch(clearModal())
    , overlayIsNowSaved: (fname, wipeWSAfterSave) => {
      dispatch(clearModal());
      if (wipeWSAfterSave)
        dispatch(setFlag(CLEAR_DRAW_WORKSPACE));
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
    this.overlayFileInputRef = React.createRef();
    this.cleanWSCheck = React.createRef();
    this.state = {validated: false};
  }

  componentDidMount() {
    const domElem = this.ref.current;
    domElem.showModal();
  }

  handleSubmit = (ev) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      const fname = this.overlayFileInputRef.current.value;
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
                            ref={this.overlayFileInputRef}
                            type="text"
                            placeholder="workspace.geojson"
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


