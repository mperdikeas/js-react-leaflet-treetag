const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { dismissToast } from './actions/index.js';

import {Toast} from 'react-bootstrap';

const mapStateToProps = (state) => {
  return {
    toasts: state.toasts

  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    dismissToast: (id)=>dispatch(dismissToast(id))
  };
};


class ToastLayer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {idToShow: {}};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.toasts.length > this.props.toasts.length) {
      console.log(`# prev toasts: ${prevProps.toasts.length}, # current toasts: ${this.props.toasts.length}`);
    }
  }

  dismissToast = (id)=>{
    console.log(`setting show to false for id ${id}`);
    this.setState({idToShow: Object.assign({}, this.state.idToShow, {[id]: false})});
    window.setTimeout( ()=>{
      console.log(`dismissing toast ${id}`);
      this.props.dismissToast(id)
    }, 500);
  }

  static getDerivedStateFromProps(props, state) {
    console.log('entering getDerivedStateFromProps, props is as follows:');
    console.log(props);
    const idToShow = {...state.idToShow};
    props.toasts.forEach( (toast) => {
      console.log(toast);
      if (idToShow[toast.id]===undefined)
        idToShow[toast.id] = true;
    });
    console.log('returning state from props as follows:');
    console.log(idToShow);
    return {idToShow};
  }

  
  render() {
    console.log('rendering ToastLayer');
    const style={position: 'absolute', top: 0, left: 0, zIndex: 99999};
    const toastsDiv = this.props.toasts.map( ({id, msg}) => {
      console.log(`id is ${id}`);
      console.log(`show is: ${this.state.idToShow[id]}`);
      return (
        <Toast show={this.state.idToShow[id]} onClose={()=>this.dismissToast(id)} animation={true}>
          <Toast.Header>
            <strong className="mr-auto">Password change</strong>
            <small>11 mins ago</small>
          </Toast.Header>
          <Toast.Body>Email with confirmation code sent to your addresss of record {msg}</Toast.Body>
        </Toast>
      );
    });
    return (
      <>
      <div style={style}>
        {toastsDiv}
      </div>
      {this.props.children}
      </>
    );

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ToastLayer));


