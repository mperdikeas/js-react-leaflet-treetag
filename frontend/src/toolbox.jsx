const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console

const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

require('./toolbox.css');

import selectTree               from './resources/select-tree-32.png';
import addBeacon                from './resources/add-beacon-32.png';
import selectGeometry           from './resources/select-geometry-32.png';
import definePolygon            from './resources/polygon-tool-32.png';
import definePolygonInProgress  from './resources/polygon-tool-in-progress-32.png';
import remove                   from './resources/andrew-cross-32.png';
import moveVertex               from './resources/move-vertex-32.png';

//import {SELECT_TREE_TOOL, ADD_BEACON_TOOL, SELECT_GEOMETRY_TOOL, DEFINE_POLYGON_TOOL, MOVE_VERTEX_TOOL, REMOVE_TOOL} from './map-tools.js';

import {SELECT_TREE, ADD_BEACON, SELECT_GEOMETRY, DEFINE_POLYGON, MOVE_VERTEX, REMOVE} from './constants/modes.js';


// redux
import { connect }          from 'react-redux';
import {toggleMode}         from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    mode: state.mode
    , geometryUnderDefinition: state.geometryUnderDefinition.length>0

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMode : (mode) => dispatch(toggleMode(mode))
    };
  }


class Toolbox extends React.Component {


  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
  }

  chooseSelectTree = (e) => {
    e.preventDefault();
    this.props.toggleMode(SELECT_TREE);
  }

  chooseAddBeacon = (e) => {
    e.preventDefault();
    this.props.toggleMode(ADD_BEACON);
  }

  chooseSelectGeometry = (e) => {
    e.preventDefault();
    this.props.toggleMode(SELECT_GEOMETRY);
  }

  chooseDefinePolygon = (e) => {
    e.preventDefault();
    this.props.toggleMode(DEFINE_POLYGON);
  }

  chooseMoveVertex = (e) => {
    e.preventDefault();
    this.props.toggleMode(MOVE_VERTEX);
  }

  chooseRemove = (e) => {
    e.preventDefault();
    this.props.toggleMode(REMOVE);
  }
  

  render = () => {
    const tools = [ {icon:selectTree     , mode: SELECT_TREE, f: this.chooseSelectTree}
                  , {icon:addBeacon      , mode: ADD_BEACON , f: this.chooseAddBeacon}
                  , {icon:selectGeometry , mode: SELECT_GEOMETRY, f: this.chooseSelectGeometry}
                  , {icon: (this.props.geometryUnderDefinition?definePolygonInProgress:definePolygon)
                    , mode: DEFINE_POLYGON
                   , f: this.chooseDefinePolygon}
                  , {icon:moveVertex     , mode: MOVE_VERTEX, f: this.chooseMoveVertex}
                  , {icon:remove         , mode: REMOVE     , f: this.chooseRemove}];
    
    const style = {display: 'block'
                 , margin: 'auto'
                 , width: 40
                 , boxSizing: 'border-box'};
    const styleFirstIcon       = Object.assign({}, style, {marginTop: '100px'});
    const styleSubsequentIcons = Object.assign({}, style, {marginTop: '10px'});

    const self = this;
    const elems = tools.map( (el, idx) => {
      const applicableStyle1 = (idx===0)?styleFirstIcon:styleSubsequentIcons;
      const applicableStyle2 = Object.assign({}
                                           , applicableStyle1
                                           , (el.mode===self.props.mode)?{border: '3px solid red'}:{});
      const linkedVersion = (
        <div key={idx} className='col-12'>
          <a href='/' onClick={el.f}>
            <img src={el.icon} style={applicableStyle2}/>
          </a>
        </div>
      );
      const unlinkedVersion = (
        <div key={idx} className='col-12'>
          <img src={el.icon} style={Object.assign({}, applicableStyle2, {opacity: 0.2})}/>
        </div>
      );
      if (this.props.geometryUnderDefinition) {
        if (el.mode===self.props.mode)
          return linkedVersion;
        else
          return unlinkedVersion;
      } else {
        return linkedVersion;
      }
    });

    return (
      <div className='row no-gutters'>
        {elems}
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Toolbox);

