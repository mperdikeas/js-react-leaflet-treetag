const React = require('react');

const assert = require('chai').assert;

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';


import {displayModal, clearModal, addToast} from './redux/actions/index.js';

import {MDL_NOTIFICATION} from './constants/modal-types.js';


import {axiosPlain} from './axios-setup.js';


import {  connect   }              from 'react-redux';


const msg = (installation, email) => {
  return `username reminder was successfully sent to the email address ${email}`+
         ` for installation ${installation}.`+
         ' Please check your email';
}

const msgHTML = (installation, email) => {
  return (<>
    <p style={{width: '27em'}}>
      {msg(installation, email)}
    </p>

    </>);
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearModal: ()=> dispatch(clearModal())
    , addToastForSuccessfulUsernameReminderSent: (installation, email)=> {
      dispatch(addToast('username reminder', msg(installation, email)));
    }
    , displayModalForSuccessfulUsernameReminderSent: (installation, email)=> {
      dispatch(displayModal(MDL_NOTIFICATION, {html: msgHTML(installation, email)}));
    }
  };
}


class UsernameReminderForm extends React.Component {



  constructor(props) {
    super(props);
    this.installationRef = React.createRef();
    this.emailRef        = React.createRef();
    this.state           = this.initialState();
  }

  initialState = () => {
    return {serverAPIFailureResponse: null, waitForServer: false};
  }

  componentWillUnmount = ()=>{
    console.log('modal-username-reminder-form: component will unmount');
  }

  sendUsernameReminder = (installation, email)=> {
    this.setState({waitForServer: true});
    console.log(`sendUsernameReminder(${installation}, ${email})`);
    const url = '/login/emailUsernameReminder';
    axiosPlain.post(url, {installation, email}).then(res => {
      if (res.data.err != null) {
        console.log('sendUsernameReminder API call error');
        assert.fail(res.data.err);
      } else {
        console.log('sendUsernameReminder API call success');
        if (res.data.t.problem===null) {
          this.setState({serverAPIFailureResponse: null, waitForServer: false});
          this.props.addToastForSuccessfulUsernameReminderSent(installation, email);
          this.props.clearModal();
          this.props.displayModalForSuccessfulUsernameReminderSent(installation, email);
        } else {
          console.log('sendUsernameReminder call was unsuccessful');
          this.setState({serverAPIFailureResponse: res.data.t.problem, waitForServer: false});
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
    const errMsg = (()=>{
      if (this.state.serverAPIFailureResponse == null)
        return null;
      else {
        const errMsgStyle= {color: 'red'};
        return (
          <div style={errMsgStyle}>
            {this.state.serverAPIFailureResponse}
          </div>
        );
      }

    })();


    const buttonForPrimaryAction = (()=>{
      if (this.state.waitForServer) {
        return <Button type="submit" disabled={true}>Please wait...</Button>
      } else {
        return <Button type="submit">Send username reminder</Button>
      }
    })();
    
    return (
      <Form noValidate onSubmit={this.handleSubmit}>
        {errMsg}
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
                        value="mperdikeas@gmail.com"
            />
          </Col>
        </Form.Group>


        <div style={buttonDivStyle}>
          <Button variant='secondary' onClick={this.props.clearModal}>Cancel</Button>
          {buttonForPrimaryAction}
        </div>
      </Form>
    );
  } // render

} // class

export default connect(null, mapDispatchToProps)(UsernameReminderForm);
