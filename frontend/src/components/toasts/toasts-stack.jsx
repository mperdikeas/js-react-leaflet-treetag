const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from '../../context/geometry-context.jsx';

import wrapContexts from '../../context/contexts-wrapper.jsx';

// redux
import {  connect   }              from 'react-redux';
import { dismissToast } from '../../actions/index.js';


import Toast from './toast.jsx';

import { isSubsetOf } from 'is-subset-of';

require('./toast.css');

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


class ToastsStack extends React.Component {

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


  makeToastVisible = (id) => {
    assert.isFalse(this.state.idToShow[id]);
    this.setState({idToShow: Object.assign({}, this.state.idToShow, {[id]: true})});
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

    console.log(`abg -rendering toasts stack`);
    const toastsDiv = Object.keys(this.props.toasts).map( (key) => {
      const {header, msg} = this.props.toasts[key];
      console.log(`abg toast ${key} has show set to ${this.state.idToShow[key]}`);
      return (
        <Toast
            key = {key}
            key2 = {key}
            show={this.state.idToShow[key]}
            makeToastVisible={this.makeToastVisible}
            dismissToast={this.dismissToast}
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
export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ToastsStack));


