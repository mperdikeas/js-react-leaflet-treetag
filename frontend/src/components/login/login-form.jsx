const React = require('react');

const assert = require('chai').assert;

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

import {connect} from 'react-redux';

import {MDL_USERNAME_REMINDER} from '../../constants/modal-types.js';


const LinkEventKeys = {FORGOT_USERNAME: 'forgot-username'
                     , FORGOT_PASSWORD: 'forgot-password'};

import {displayModal} from '../../redux/actions/index.js';
import login          from '../../redux/actions/login.js';



import wrapContexts from '../../context/contexts-wrapper.tsx';


const mapDispatchToProps = (dispatch) => {
  return {
    login: ({installation, username, password}, updateLogin, followUpFunc)=>dispatch(login({installation, username, password}, updateLogin, followUpFunc))
    , displayUsernameReminderModal: () => dispatch(displayModal(MDL_USERNAME_REMINDER))
    };
  }

class LoginForm extends React.Component {



  constructor(props) {
    super(props);
    this.inputInstallationRef = React.createRef();
    this.inputUsernameRef     = React.createRef();
    this.inputPasswordRef     = React.createRef();
  }


  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const installation = this.inputInstallationRef.current.value;
    const username     = this.inputUsernameRef.current.value;
    const password     = this.inputPasswordRef.current.value;
    this.props.login({installation, username, password}
                   , this.props.loginContext.updateLogin
                   , this.props.followUpFunc);
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

        <Form.Group as={Row} controlId="installation">
          <Form.Label column sm='4'>Installation</Form.Label>
          <Col sm='8'>
            <Form.Control
            ref={this.inputInstallationRef}
            required
            type="text"
            placeholder="installation"
            value="a1"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="username">
          <Form.Label column sm='4'>Username</Form.Label>
          <Col sm='8'>
            <Form.Control
                        ref={this.inputUsernameRef}
                        required
                        type="text"
                        placeholder="username"
                        value="admin"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="password">
          <Form.Label column sm='4'>Password</Form.Label>
          <Col sm='8'>
            <Form.Control
                                    ref={this.inputPasswordRef}
                                    sm='10'
                                    required
                                    type="password"
                                    placeholder="secret"
                                    value="pass"
            />
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.Check label="Remember me on this machine"/>
        </Form.Group>

        <Button type="submit">Login</Button>
      <Nav className="justify-content-center" onSelect={this.onSelect}>
        <Nav.Item>
          <Nav.Link eventKey="forgot-username">forgot username</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="forgot-password">forgot password</Nav.Link>
        </Nav.Item>
      </Nav>
      </Form>
    );
  } // render

} // class

// TODO: only wrap the necessary context - loginContext in this case
export default connect(null, mapDispatchToProps)(wrapContexts(LoginForm));
