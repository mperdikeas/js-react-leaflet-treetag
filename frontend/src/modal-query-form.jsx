const React = require('react');

const assert = require('chai').assert;

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

import {MDL_USERNAME_REMINDER} from './constants/modal-types.js';

import {axiosAuth} from './axios-setup.js';

const LinkEventKeys = {FORGOT_USERNAME: 'forgot-username'
                     , FORGOT_PASSWORD: 'forgot-password'};

import {clearModal, displayModal} from './actions/index.js';

import {connect} from 'react-redux';


const mapDispatchToProps = (dispatch) => {
  return {
    clearModal: ()=>dispatch(clearModal()),
    displayUsernameReminderModal: () => dispatch(displayModal(MDL_USERNAME_REMINDER))
  };
}

class ModalQueryForm extends React.Component {



  constructor(props) {
    super(props);
    this.inputInstallationRef = React.createRef();
    this.inputUsernameRef     = React.createRef();
    this.inputPasswordRef     = React.createRef();
  }


  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.doQuery();
  };

  onSelect = (eventKey)=>{
    console.log(`${eventKey} selected`);
    switch (eventKey) {
      case LinkEventKeys.FORGOT_USERNAME:
        this.props.displayUsernameReminderModal();
        break;
      case LinkEventKeys.FORGOT_PASSWORD:
        break;
      default:
        
        assert.fail(`unrecognized eventKey: ${eventKey}`);
    }
  }

  render = ()=> {
    return (
      <Form noValidate onSubmit={this.handleSubmit}>

        <div>Select all trees in the polygons of the workspace</div>
        <div style={{display: 'flex'
                   , flexDirection:'row'
                   , justifyContent: 'space-around'}}>
          <Button variant="secondary" onClick={this.props.clearModal}>Cancel</Button>
          <Button type="submit">Execute query</Button>
        </div>
      </Form>
    );
  } // render

} // class

export default connect(null, mapDispatchToProps)(ModalQueryForm);
