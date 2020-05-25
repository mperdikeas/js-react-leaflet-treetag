const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;



import {storeAccessToken} from './access-token-util.js';

import wrapContexts from './context/contexts-wrapper.jsx';

import {axiosPlain} from './axios-setup.js';


// redux
import {  connect   } from 'react-redux';
import { clearModal } from './actions/index.js';




import ModalLoginForm from './modal-login-form.jsx';

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

    this.state = {
      logErrMsg: null
    };    
  }

  componentDidMount() {
    const domElem = this.ref.current;
    domElem.showModal();
    const body = document.getElementsByTagName('body')[0];
    this.escapeKeySuppressor = (e)=>{
      console.log(`key pressed: ${e.code}`);
      if (e.code === 'Escape') {
        console.log('preventing default and stopping propagation');
        e.preventDefault();
        e.stopPropagation();
        }
    };
    document.addEventListener('keydown', this.escapeKeySuppressor);
    $('#dialog').draggable();
  }

  componentWillUnmount() {
    console.log('component will unmount');
    const body = document.getElementsByTagName('body')[0];
    document.removeEventListener('keydown', this.escapeKeySuppressor);
    }


  doLogin = (installation, username, password) => {
    console.log(`modal-login::doLogin(${installation}, ${username}, ${password}`);
    const url = '/login';
    axiosPlain.post(url, {
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
    return (
      <>
      <dialog style={this.props.style} id='dialog' ref={this.ref}>
          <ModalLoginForm doLogin={this.doLogin}/>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalLogin));


