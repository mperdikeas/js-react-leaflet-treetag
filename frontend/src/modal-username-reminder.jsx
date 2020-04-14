const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

import UsernameReminderForm from './modal-username-reminder-form.jsx';



class ModalUsernameReminder extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const domElem = this.ref.current;
    domElem.showModal();
    /*
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
    */
    $('#dialog').draggable(); // this aint' working
  }


  /*
  componentWillUnmount() {
    console.log('component will unmount');
    const body = document.getElementsByTagName('body')[0];
    document.removeEventListener('keydown', this.escapeKeySuppressor);
    }
  */

  render() {

    return (
      <>
      <dialog id="dialog" ref={this.ref} style={{width: '70%'}}>
          <UsernameReminderForm/>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default ModalUsernameReminder;


