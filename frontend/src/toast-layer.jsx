const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { dismissToast } from './actions/index.js';

import {Toast} from 'react-bootstrap';

import { isSubsetOf } from 'is-subset-of';

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

  componentDidMount() {
    const idToShow2 = {...this.state.idToShow};
    Object.keys(this.state.idToShow).forEach( (idx) => {
      idToShow2[idx]=true;
      console.log(`componentDidMount :: set show of ${idx} to true`);
    });
    this.setState({idToShow:idToShow2});
  }


  componentDidUpdate(prevProps, prevState) {
    // if a new state was added with show:false set it to true (to make it appear)
    const prevIndices = Object.keys(prevState.idToShow);
    const newIndices =  Object.keys(this.state.idToShow);
    console.log(`componentDidUpdate: prev indices is: ${JSON.stringify(prevIndices)}, new indices is ${JSON.stringify(newIndices)}`);
    if (Object.keys(prevState.idToShow).length < Object.keys(this.state.idToShow).length) {
      console.log(`componentDidUpdate: new state was added, lengths are ${Object.keys(prevState.idToShow).length} , ${Object.keys(this.state.idToShow)}`);
      if (isSubsetOf(Object.keys(prevState.idToShow), Object.keys(this.state.idToShow))) {
        const idToShow2 = {...this.state.idToShow};
        const n = 0;
        Object.keys(this.state.idToShow).forEach( (idx) => {
          if ((this.state.idToShow[idx]===false) && (prevState.idToShow[idx]===undefined)) {
            idToShow2[idx]=true;
            console.log(`componentDidUpdate: set show of ${idx} to true`);
            n ++;
          }
        });
        console.log(`componentDidUpdate: set a total of ${n} indices to true`);
        assert.isTrue(n>=1, `unexpected number of updates: ${n}`);
        this.setState({idToShow:idToShow2});
      } else {
        assert.fail('unexpected situation');
      }
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
    const propToastIds = Object.keys(props.toasts);
    const stateToastIds = Object.keys(state.idToShow);
    if (isSubsetOf(propToastIds, stateToastIds)) {
      // a toast id has been removed from the DOM - delete the key from state:
      const idToShow2 = {...state.idToShow};
      stateToastIds.forEach( (el)=> {
        if (propToastIds.indexOf(el)===-1) {
          delete idToShow2[el];
          console.log(`getDerivedStateFromProps: deleted key ${el} from state.idToShow`);
        }
      });
      return {idToShow: idToShow2};
    } else if (isSubsetOf(stateToastIds, propToastIds)) {
      // a new toast has been added - add the key to state with show=false
      const idToShow2 = {...state.idToShow};
      propToastIds.forEach( (el)=> {
        if (stateToastIds.indexOf(el)===-1) {
          idToShow2[el]=false;
          console.log(`getDerivedStateFromProps: added key ${el} to state.idToShow`);
        }
      });
      return {idToShow: idToShow2};
    } else {
      assert.fail('totally unexpected situation');
    }
  }
/*    
    console.log('entering getDerivedStateFromProps, props is as follows:');
    console.log(props);
    console.log('state is as follows:');
    console.log(state);
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
*/
  
  render() {
    console.log('rendering ToastLayer');
    const style={position: 'absolute', top: 0, left: 0, zIndex: 99999};
    const toastsDiv = Object.keys(this.props.toasts).map( (key) => {
      const {msg} = this.props.toasts[key];
      console.log(`toast-layer::render() key is ${key}, show is: ${this.state.idToShow[key]}`);
      return (
        <Toast show={this.state.idToShow[key]} onClose={()=>this.dismissToast(key)} animation={true}>
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


