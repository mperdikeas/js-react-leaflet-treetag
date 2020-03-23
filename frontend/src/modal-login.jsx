const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import axios from 'axios';
import {setCookie}                             from './util.js';

import {GeometryContext} from './context/geometry-context.jsx';

import TilesSelector                           from './tiles-selector.jsx';
import Map                                     from './map.jsx';
import TreeInformationPanel                    from './information-panel-tree.jsx';
import InformationPanelGeometryDefinition      from './information-panel-geometry-definition.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import Toolbox                                 from './toolbox.jsx';
import {SELECT_TREE_TOOL, DEFINE_POLYGON_TOOL} from './map-tools.js';
import {BASE_URL}                              from './constants.js';

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
    this.inputUsernameRef     = React.createRef();
    this.inputPasswordRef     = React.createRef();

    this.state = {
      logErrMsg: null
    };    
  }

  componentDidMount() {
    console.log('ModalLogin::componentDidMount');
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
    const username = this.inputUsernameRef.current.value;
    const password = this.inputPasswordRef.current.value;
    this.doLogin(username, password);
  }

    
  doLogin = (username, password) => {
    const url = `${BASE_URL}/login`;
    axios.post(url, {
      username: username,
      password: password
    }).then(res => {
      if (res.data.err != null) {
        console.log('login API call error');
        assert.fail(res.data.err);
      } else {
        console.log('login API call success');
        if (res.data.t.loginFailureReason===null) {
          setCookie('access_token', res.data.t.accessToken, 0);
          console.log('login was successful and cookie was set');
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
    const {nameInput, passInput} = (()=>{
      const useHardcodedValues = true;
      if (useHardcodedValues)
        return {nameInput: <><input ref={this.inputUsernameRef} type='text' id='login-name-input' value='admin'/><br/></>
              , passInput: <><input ref={this.inputPasswordRef} type='text' id='login-pass-input' value='pass'/><br/></>};
      else return {nameInput: <><input ref={this.inputUsernameRef} type='text' id='login-name-input' /><br/></>
                 , passInput: <><input ref={this.inputPasswordRef} type='text' id='login-pass-input' /><br/></>};
      

      })();
    return (
      <>
      <dialog id="dialog" ref={this.ref}>
        <form method="dialog" onSubmit={this.login}>
          {logErrMsg}
          <p>Please provide your username and password</p>
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


