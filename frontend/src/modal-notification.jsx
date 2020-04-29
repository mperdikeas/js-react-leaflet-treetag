const React = require('react');


const assert = require('chai').assert;



// redux
import { connect } from 'react-redux';
import { clearModal } from './actions/index.js';

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

const mapDispatchToProps = (dispatch) => {
  return {
    clearModal: ()=> dispatch(clearModal())
  };
}

class ModalNotification extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount = () => {
    const domElem = this.ref.current;
    domElem.showModal();
  }

  render() {
    return (
      <>
      <dialog style={{width: '17em'}}ref={this.ref}>
        <div>{this.props.html}</div>
        <div style={{display:'flex', justifyContent: 'center'}}>
          <Button style={{marginTop: '1em'}} variant='primary' onClick={this.props.clearModal}>OK</Button>
        </div>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(null, mapDispatchToProps)(ModalNotification);


