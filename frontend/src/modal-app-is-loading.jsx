const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;



import {storeAccessToken} from './access-token-util.js';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

import {axiosPlain} from './axios-setup.js';


// redux
import {  connect, mapDispatchToProps   } from 'react-redux';
import { clearModal } from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    modal: state.modal
  };
};


class ModalAppIsLoading extends React.Component {

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
      <dialog id='app-is-loading' ref={this.ref}>
        <div>Please wait while app is loading &hellip; </div>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalAppIsLoading));


