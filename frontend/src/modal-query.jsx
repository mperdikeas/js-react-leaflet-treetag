const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;



import {storeAccessToken} from './access-token-util.js';

import wrapContexts from './context/contexts-wrapper.jsx';

import {axiosPlain} from './axios-setup.js';


// redux
import {  connect   } from 'react-redux';
import { clearModal } from './actions/index.js';




import ModalQueryForm from './modal-query-form.jsx';

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

class ModalQuery extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const domElem = this.ref.current;
    domElem.showModal();
    const body = document.getElementsByTagName('body')[0];
    this.escapeKeySuppressor = (e)=>{
      if (e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        }
    };
    document.addEventListener('keydown', this.escapeKeySuppressor);
    $('#dialog').draggable();
  }

  componentWillUnmount() {
    const body = document.getElementsByTagName('body')[0];
    document.removeEventListener('keydown', this.escapeKeySuppressor);
    }


  doQuery = () => {
    console.log(`we are now ready to do a query`);
  }



  render() {

    return (
      <>
      <dialog style={this.props.style} id='dialog' ref={this.ref}>
          <ModalQueryForm doQuery={this.doQuery}/>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalQuery));


