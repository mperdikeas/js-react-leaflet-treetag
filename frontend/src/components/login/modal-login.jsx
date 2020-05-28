const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

// redux
import {  connect   }     from 'react-redux';
import { clearModal }     from '../../actions/index.js';
import {storeAccessToken} from '../../access-token-util.js';
import wrapContexts       from '../../context/contexts-wrapper.jsx';
import {axiosPlain}       from '../../axios-setup.js';

import LoginForm     from './login-form.jsx';

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


  render() {
    return (
      <>
      <dialog style={this.props.style} id='dialog' ref={this.ref}>
          <LoginForm/>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalLogin));


