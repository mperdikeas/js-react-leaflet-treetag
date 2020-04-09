const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import wrapContexts from './context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { dismissToast } from './actions/index.js';

import {Toast} from 'react-bootstrap';

import ToastWrapper from './toast-wrapper.jsx';

import { isSubsetOf } from 'is-subset-of';

require('./css/toast.css');

const mapStateToProps = (state) => {
  return {
    toasts: state.toasts

  };
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
    if (prevIndices.length < newIndices.length) {
      if (isSubsetOf(Object.keys(prevState.idToShow), Object.keys(this.state.idToShow))) {
        const idToShow2 = {...this.state.idToShow};
        let n = 0;
        Object.keys(this.state.idToShow).forEach( (idx) => {
          if ((this.state.idToShow[idx]===false) && (prevState.idToShow[idx]===undefined)) {
            idToShow2[idx]=true;
            n ++;
          }
        });
        // maybe I ought to be more lenient and relax the following to n>=1
        assert.isTrue(n===1, `unexpected number of updates: ${n}`);
        this.setState({idToShow:idToShow2});
      } else {
        assert.fail(`unexpected situation prevIndices=${JSON.stringify(prevIndices)}, newIndices=${JSON.stringify(newIndices)}`);
      }
   }
  }

  dismissToast = (id)=>{
    this.setState({idToShow: Object.assign({}, this.state.idToShow, {[id]: false})});
    window.setTimeout( ()=>{
      this.props.dismissToast(id)
    }, 500);
  }

  static getDerivedStateFromProps(props, state) {
    const propToastIds = Object.keys(props.toasts);
    const stateToastIds = Object.keys(state.idToShow);
    if (isSubsetOf(propToastIds, stateToastIds)) {
      // a toast has been removed from the DOM - delete the key from state:
      const idToShow2 = {...state.idToShow};
      stateToastIds.forEach( (el)=> {
        if (propToastIds.indexOf(el)===-1) {
          delete idToShow2[el];
        }
      });
      return {idToShow: idToShow2};
    } else if (isSubsetOf(stateToastIds, propToastIds)) {
      // a new toast has been added - add the key to state with show=false
      const idToShow2 = {...state.idToShow};
      propToastIds.forEach( (el)=> {
        if (stateToastIds.indexOf(el)===-1) {
          idToShow2[el]=false;
        }
      });
      return {idToShow: idToShow2};
    } else {
      assert.fail(`totally unexpected situation. PropToastIds is ${JSON.stringify(propToastIds)}, stateToastIds is ${JSON.stringify(stateToastIds)}`);
    }
  }
  
  render() {
    const toastContainerStyle={position: 'absolute'
                             , top: this.props.geometryContext.topOfToastDiv()
                             , left: this.props.geometryContext.leftOfToastDiv()
                             , width: this.props.geometryContext.geometry.toastDiv.width
                             , zIndex: 99999};

    const toastsDiv = Object.keys(this.props.toasts).map( (key) => {
      const {header, msg} = this.props.toasts[key];
      console.log(`toast-layer::render() key is ${key}, show is: ${this.state.idToShow[key]}`);
      return (
        <ToastWrapper
        key = {key}
        show={this.state.idToShow[key]}
        onClose={()=>this.dismissToast(key)}
        header={header}
        msg={msg}
        />
      );
    });
    return (
      <>
      <div style={toastContainerStyle}>
        {toastsDiv}
      </div>
      {this.props.children}
      </>
    );

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ToastLayer));


