const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

// redux
import {  connect   } from 'react-redux';
import { clearModal } from './redux/actions/index.js';

import {globalGet, GSN} from './globalStore.js';



const mapDispatchToProps = (dispatch) => {
  return {
    clearModal: ()=>dispatch(clearModal())    
    , insertOverlay: (geoJSON) => {
      console.log('-----------------------');
      console.log(geoJSON);
      console.log('-----------------------');
      globalGet(GSN.REACT_MAP).insertGeoJSONIntoWorkspace(JSON.parse(geoJSON));
      dispatch(clearModal());
    }
  };
}

class ModalInsertGeoJSONToWorkspace extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.overlayFileInputRef = React.createRef();
    this.state = {validated: false, readFromFile: null};
  }

  
  componentDidMount() {
    const domElem = this.ref.current;
    domElem.showModal();

    this.overlayFileInputRef.current.addEventListener("change", (event) => {
      console.log('listener added');
      var reader = new FileReader();
      console.log('2nd layer listener added');
      reader.addEventListener('load', (e) => {
        const text = reader.result;
        console.log('contents are:');
        console.log(text);
        console.log('end of contents.');
        this.setState({readFromFile: text});
      });
      reader.readAsText(event.target.files[0]);
    });
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const form = ev.currentTarget;
    if (form.checkValidity() === true) {
      assert.isNotNull(this.state.readFromFile);
      const overlayGeoJSON = this.state.readFromFile;
      this.props.insertOverlay(overlayGeoJSON);
    }
    this.setState({validated: true});
  }


  render() {
    return (
      <>
      <dialog id="dialog" ref={this.ref}>
        <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{marginBottom: '1em'}}>Import an overlay from disk into the current workspace</div>
            <Form.Group as={Col} controlId="overlay">
              <Form.Control required
                            ref={this.overlayFileInputRef}
                            type='file'
                            accept='application/json'
              />
              <Form.Control.Feedback>
                Looks good!
              </Form.Control.Feedback>              
              <Form.Control.Feedback type="invalid">
                υποχρεωτικό πεδίο
              </Form.Control.Feedback>              
            </Form.Group>
            <div style={{display: 'flex'
                       , flexDirection:'row'
                       , justifyContent: 'space-around'}}>
              <Button variant="secondary" onClick={this.props.clearModal}>Cancel</Button>
              <Button type="submit">Load</Button>
            </div>
          </div>
        </Form>
      </dialog>
      {this.props.children}
      </>
    );
  }
}


export default connect(null, mapDispatchToProps)(wrapContexts(ModalInsertGeoJSONToWorkspace));


