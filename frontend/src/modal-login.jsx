const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import axios from 'axios';
import {BASE_URL}                              from './constants.js';

import {storeAccessToken} from './access-token-util.js';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   } from 'react-redux';
import { clearModal } from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    modal: state.modal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearModal : () => dispatch(clearModal())
  };
}

class ModalLogin extends React.Component {

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
    domElem.showModal();
  }

  componentDidUpdate2(prevProps, prevState) {
    if (!prevProps.modal.modalType && this.props.modal.modalType) {
      const domElem = this.ref.current;
      domElem.showModal();
    }
  }


  login = (ev) => {
    ev.preventDefault();
    const installation = this.inputInstallationRef.current.value;
    const username     = this.inputUsernameRef.current.value;
    const password     = this.inputPasswordRef.current.value;
    this.doLogin(installation, username, password);
  }

    
  doLogin = (installation, username, password) => {
    const url = `${BASE_URL}/login`;
    axios.post(url, {
      installation: installation,
      username: username,
      password: password
    }).then(res => {
      if (res.data.err != null) {
        console.log('login API call error');
        assert.fail(res.data.err);
      } else {
        console.log('login API call success');
        if (res.data.t.loginFailureReason===null) {
          storeAccessToken(res.data.t.accessToken);
          this.props.clearModal();
          this.props.loginContext.updateLogin(username);
        } else {
          console.log('login was unsuccessful');
          this.setState({logErrMsg: res.data.t.loginFailureReason});
        }
      }
    }).catch( err => {
      console.log(err);
      console.log(JSON.stringify(err));
      assert.fail(err);
    });
  }



  render() {
    const logErrMsg = (()=>{
      const msg = this.state.logErrMsg
      if (msg)
        return <div style={{color: 'red'}}>{msg}</div>;
      else
        return null;
    })();
    const {installationInput, nameInput, passInput} = (()=>{
      const useHardcodedValues = true;
      if (useHardcodedValues)
        return {installationInput: <><input ref={this.inputInstallationRef} type='text' id='installation-input' value='a1'/><br/></>
          , nameInput: <><input ref={this.inputUsernameRef} type='text' id='login-name-input' value='admin'/><br/></>
              , passInput: <><input ref={this.inputPasswordRef} type='text' id='login-pass-input' value='pass'/><br/></>};
      else return {
        installationInput: <><input ref={this.inputInstallationRef} type='text' id='installation-input' /><br/></>
        , nameInput: <><input ref={this.inputUsernameRef} type='text' id='login-name-input' /><br/></>
                 , passInput: <><input ref={this.inputPasswordRef} type='text' id='login-pass-input' /><br/></>};
      

      })();
    return (
      <>
      <dialog id="dialog" ref={this.ref}>
        <form method="dialog" onSubmit={this.login}>
          {logErrMsg}
          <p>Please provide installation name,  username and password</p>
          <label htmlFor='installation-input'>Installation</label>
          {installationInput}
          <label htmlFor='login-name-input'>Username</label>
          {nameInput}
          <label htmlFor='login-pass-input'>Password</label>
          {passInput}
          <input type="submit" value="OK"/>
        </form>
      </dialog>
      {this.props.children}
      </>
    )

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalLogin));


