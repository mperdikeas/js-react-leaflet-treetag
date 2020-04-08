const React = require('react');

const assert = require('chai').assert;

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';


import {clearModal} from './actions/index.js';

import {axiosPlain} from './axios-setup.js';



// redux
import {  connect   }              from 'react-redux';


const mapDispatchToProps = (dispatch) => {
  return {
    clearModal: ()=> dispatch(clearModal())
  };
}


class UsernameReminderForm extends React.Component {



  constructor(props) {
    super(props);
    this.installationRef = React.createRef();
    this.emailRef        = React.createRef();
  }


  componentWillUnmount = ()=>{
    console.log('modal-username-reminder-form: component will unmount');
    }

  sendUsernameReminder = (installation, email)=> {
    console.log(`sendUsernameReminder(${installation}, ${email})`);
    const url = '/login/emailUsernameReminder';
    axiosPlain.post(url, {installation, email}).then(res => {
      if (res.data.err != null) {
        console.log('sendUsernameReminder API call error');
        assert.fail(res.data.err);
      } else {
        console.log('sendUsernameReminder API call success');
        if (res.data.t.loginFailureReason===null) {
          storeAccessToken(res.data.t.accessToken);
          this.props.clearModal();
          this.props.loginContext.updateLogin(username);
        } else {
          console.log('sendUsernameReminder call was unsuccessful');
          this.setState({logErrMsg: res.data.t.loginFailureReason});
        }
      }
    }).catch( err => {
      console.log(err);
      console.log(JSON.stringify(err));
      assert.fail(err);
    });
  }

  handleSubmit = (event) => {
    console.log('modal-login-form::handleSubmit');
    event.preventDefault();
    event.stopPropagation();
    const installation = this.installationRef.current.value;
    const email        = this.emailRef.current.value;
    this.sendUsernameReminder(installation, email);
  };


  render = ()=> {
    const buttonDivStyle={display:'flex'
                        , direction:'flex-flow'
                        , justifyContent:'space-around'};
    return (
      <Form noValidate onSubmit={this.handleSubmit}>
        <div style={{marginBottom: '1em'}}>Please provide the following information
          to allow us to send you the username reminder</div>
        <Form.Group as={Row} controlId="installation">
          <Form.Label column sm='4'>Installation</Form.Label>
          <Col sm='8'>
            <Form.Control
            ref={this.installationRef}
            required
            type="text"
            placeholder="installation"
            value="a1"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="email">
          <Form.Label column sm='4'>email</Form.Label>
          <Col sm='8'>
            <Form.Control
                        ref={this.emailRef}
                        required
                        type="text"
                        placeholder="username"
                        value="admin"
            />
          </Col>
        </Form.Group>


        <div style={buttonDivStyle}>
          <Button variant='secondary' onClick={this.props.clearModal}>Cancel</Button>
          <Button type="submit">Send username reminder</Button>
        </div>
      </Form>
    );
  } // render

} // class

export default connect(null, mapDispatchToProps)(UsernameReminderForm);
