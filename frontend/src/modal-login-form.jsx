const React = require('react');

import {Form, Col, Row, Button} from 'react-bootstrap';



export default class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.inputInstallationRef = React.createRef();
    this.inputUsernameRef     = React.createRef();
    this.inputPasswordRef     = React.createRef();

    this.state = {
      logErrMsg: null
    };    
  }


  componentDidMount() {
    const domElem = this.ref.current;
    this.escapeKeySuppressor = (e)=>{
      console.log(`key pressed: ${e.keyCode}`);
      if (e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    domElem.addEventListener('keyup', this.escapeKeySuppressor);
  }

  

  handleSubmit = (event) => {
    console.log('modal-login-form::handleSubmit');
    event.preventDefault();
    event.stopPropagation();
    const installation = this.inputInstallationRef.current.value;
    const username     = this.inputUsernameRef.current.value;
    const password     = this.inputPasswordRef.current.value;
    this.props.doLogin(installation, username, password);
  };

  render = ()=> {
    return (
      <Form ref={this.ref} noValidate onSubmit={this.handleSubmit}>

        <Form.Group as={Row} controlId="installation">
          <Form.Label column sm='4'>Installation</Form.Label>
          <Col sm='8'>
            <Form.Control
            ref={this.inputInstallationRef}
            required
            type="text"
            placeholder="installation"
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
            />
          </Col>
        </Form.Group>
        <Form.Group>
          <Form.Check label="Remember me on this machine"/>
        </Form.Group>

        <Button type="submit">Submit form</Button>

      </Form>
    );
  } // render

} // class
