const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;



import {storeAccessToken} from './access-token-util.js';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

import {axiosPlain} from './axios-setup.js';



class ModalNotificationNoDismiss extends React.Component {

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
      <dialog style={this.props.style} ref={this.ref}>
        <div>{this.props.html}</div>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default ModalNotificationNoDismiss;


