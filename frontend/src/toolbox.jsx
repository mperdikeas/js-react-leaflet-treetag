const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console

const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

require('./toolbox.css');

import saveWorkspaceToDisk      from './resources/save-workspace-to-disk-32.png';
import uploadLayerToCloud       from './resources/upload-layer-to-cloud-32.png';
import insertGeoJSONToWorkspace from './resources/insert-geoJSON-to-workspace-32.png';


// redux
import { connect }          from 'react-redux';
import {toggleMode, displayModal}         from './actions/index.js';

import {MDL_SAVE_WS_2_DSK, MDL_INS_GJSON_2_WS} from './constants/modal-types.js';
import {GSN, globalGet} from './globalStore.js';


const mapDispatchToProps = (dispatch) => {
  return {
      saveWorkspaceToDisk: (geoJSON) => dispatch(displayModal(MDL_SAVE_WS_2_DSK, {geoJSON}))
    , insertGeoGSONToWorkspace: () => dispatch(displayModal(MDL_INS_GJSON_2_WS))
    , uploadLayerToCloud: () => dispatch(displayModal())
    };
  }


class Toolbox extends React.Component {


  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
  }


  saveWorkspaceToDisk = (e) => {
    console.log('save workspace to disk');
    e.preventDefault();
    const drawnItems = globalGet(GSN.LEAFLET_DRAWN_ITEMS);
    const geoJSON = drawnItems.toGeoJSON(7);
    this.props.saveWorkspaceToDisk(geoJSON);
  }


  chooseUploadLayerToCloud = (e) => {
    e.preventDefault();
    const drawnItems = globalGet(GSN.LEAFLET_DRAWN_ITEMS);
    console.log('toolbox', drawnItems.toGeoJSON(7));
  }

  insertGeoJSONToWorkspace = (e) => {
    e.preventDefault();
    this.props.insertGeoGSONToWorkspace();
  }


  render = () => {
    const tools = [{icon:saveWorkspaceToDisk , mode: null, f: this.saveWorkspaceToDisk}
                 , {icon:uploadLayerToCloud , mode: null, f: this.chooseUploadLayerToCloud}
                 , {icon: insertGeoJSONToWorkspace, mode: null, f: this.insertGeoJSONToWorkspace}];
    
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


export default connect(null, mapDispatchToProps)(Toolbox);

