const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

require('./toolbox.css');

import saveWorkspaceToDisk      from './resources/save-workspace-to-disk-32.png';
import uploadLayerToCloud       from './resources/upload-layer-to-cloud-32.png';
import insertGeoJSONToWorkspace from './resources/insert-geoJSON-to-workspace-32.png';
import selectTree               from './resources/select-tree-32.png';
import query                    from './resources/question-32.png';


// redux
import { connect }                          from 'react-redux';
import {toggleMode, displayModal, addToast} from './actions/index.js';

import {MDL_NOTIFICATION
      , MDL_SAVE_WS_2_DSK
      , MDL_INS_GJSON_2_WS
      , MDL_QUERY} from './constants/modal-types.js';

import {GSN, globalGet} from './globalStore.js';

let i = 0;

const mapDispatchToProps = (dispatch) => {
  return {
    displayWorkspaceIsEmptyNotification: () => {
      const html = (<div style={{marginBottom: '1em'}}>Workspace layer has nothing to save</div>);
      dispatch(displayModal(MDL_NOTIFICATION, {html}));
    }
    , saveWorkspaceToDisk: (geoJSON) => dispatch(displayModal(MDL_SAVE_WS_2_DSK, {geoJSON}))
    , insertGeoGSONToWorkspace: () => dispatch(displayModal(MDL_INS_GJSON_2_WS))
    , uploadLayerToCloud: () => dispatch(displayModal())
    , selectTree: ()=>dispatch(addToast(i, 'this is some random toast'))
    , query: ()=>dispatch(displayModal(MDL_QUERY))
    };
  }


class Toolbox extends React.Component {


  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
  }


  saveWorkspaceToDisk = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const drawnItems = globalGet(GSN.REACT_MAP).drawnItems;
    if (drawnItems.getLayers().length === 0) {
      this.props.displayWorkspaceIsEmptyNotification();
    } else {
      const drawnItems2 = L.featureGroup(drawnItems.getLayers());
      const queryResults = globalGet(GSN.REACT_MAP).queryLayer;
      queryResults.eachLayer( (marker) => {
        drawnItems2.addLayer(marker);
      });
      const geoJSON = drawnItems2.toGeoJSON(7);
      this.props.saveWorkspaceToDisk(geoJSON);
    }
  }


  chooseUploadLayerToCloud = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const drawnItems = globalGet(GSN.REACT_MAP).drawnItems;
  }

  insertGeoJSONToWorkspace = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.insertGeoGSONToWorkspace();
  }

  selectTree = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.selectTree();
    i++;
  }

  query = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.query();
  }

  render = () => {
    const tools = [{icon:saveWorkspaceToDisk , mode: null, f: this.saveWorkspaceToDisk}
                 , {icon:uploadLayerToCloud , mode: null, f: this.chooseUploadLayerToCloud}
                 , {icon: insertGeoJSONToWorkspace, mode: null, f: this.insertGeoJSONToWorkspace}
                 , {icon:selectTree, mode: null, f: this.selectTree}
                 , {icon:query, mode: null, f: this.query}
    ];
    
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

