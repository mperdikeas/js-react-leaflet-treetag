const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

require('./toolbox.css');

import saveWorkspaceToDisk      from './resources/save-workspace-to-disk-32.png';
import uploadLayerToCloud       from './resources/upload-layer-to-cloud-32.png';
import insertGeoJSONToWorkspace from './resources/insert-geoJSON-to-workspace-32.png';
import selectTree               from './resources/select-tree-32.png';
import query                    from './resources/question-32.png';
import centerOnTarget           from './resources/target-32.png';

// redux
import { connect }                          from 'react-redux';
import {toggleMode, displayModal, addToast} from './actions/index.js';

import {MDL_NOTIFICATION
      , MDL_SAVE_WS_2_DSK
      , MDL_INS_GJSON_2_WS
      , MDL_QUERY} from './constants/modal-types.js';

import {GSN, globalGet} from './globalStore.js';

import {msgTreeDataIsDirty} from './common.jsx';

const mapStateToProps = (state) => {
  return {
    targetId      : state.targetId,
    targetIsDirty : state.targetIsDirty
  };
};


const mapDispatchToProps = (dispatch) => {
  return {dispatch};
}

// refid: SSE-1589888176
const mergeProps = ( {targetId, targetIsDirty}, {dispatch}) => {
  return {
    targetId
    , targetIsDirty
    , displayWorkspaceIsEmptyNotification: () => {
      const html = (<div style={{marginBottom: '1em'}}>Workspace layer has nothing to save</div>);
      dispatch(displayModal(MDL_NOTIFICATION, {html}));
    }
    , displayNotificationNoTargetSelected: ()=>{
      const html = <div style={{marginBottom: '1em'}}>Δεν έχει επιλεγεί κάποιο δένδρο</div>;
      dispatch(displayModal(MDL_NOTIFICATION, {html}));
    }
    , displayNotificationTargetIsDirty  : ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataIsDirty(targetId)}))    
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

  displayNotificationIfTargetIsDirty = () => {
    console.log(`this.props.targetIsDirty = ${this.props.targetIsDirty}`);
    if (this.props.targetIsDirty) {
      this.props.displayNotificationTargetIsDirty();
      return true;
    } else
    return false;
  }

  saveWorkspaceToDisk = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.displayNotificationIfTargetIsDirty()) {
        const drawnItems = globalGet(GSN.REACT_MAP).drawnItems;
        if (drawnItems.getLayers().length === 0) {
          this.props.displayWorkspaceIsEmptyNotification();
        } else {
          let drawnItems2 = drawnItems;
          const queryResults = globalGet(GSN.REACT_MAP).queryLayer;
          if (queryResults !== null) {
            const drawnItems2 = L.featureGroup(drawnItems.getLayers());
            queryResults.eachLayer( (marker) => {
              drawnItems2.addLayer(marker);
            });
          }
          const geoJSON = drawnItems2.toGeoJSON(7);
          this.props.saveWorkspaceToDisk(geoJSON);
        }
    }
  }


  chooseUploadLayerToCloud = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.displayNotificationIfTargetIsDirty()) {
      const drawnItems = globalGet(GSN.REACT_MAP).drawnItems;
    }
  }

  insertGeoJSONToWorkspace = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.insertGeoGSONToWorkspace();
    }
  }

  selectTree = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.selectTree();
    }
  }

  query = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.query();
    }
  }

  centerOnTarget = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`center on target ${this.props.targetId}`);
    if (this.props.targetId) {
      const marker = globalGet(GSN.REACT_MAP).getMarker(this.props.targetId)
      globalGet(GSN.REACT_MAP).map.setView(marker.getLatLng(), 15);
    } else {
      assert.isDefined(this.props.targetId);
      this.props.displayNotificationNoTargetSelected();        
    }
  }

  render = () => {
    const tools = [{icon:saveWorkspaceToDisk , mode: null, f: this.saveWorkspaceToDisk}
                 , {icon:uploadLayerToCloud , mode: null, f: this.chooseUploadLayerToCloud}
                 , {icon: insertGeoJSONToWorkspace, mode: null, f: this.insertGeoJSONToWorkspace}
                 , {icon:selectTree, mode: null, f: this.selectTree}
                 , {icon:query, mode: null, f: this.query}
                 , {icon:centerOnTarget, mode: null, f: this.centerOnTarget}
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


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Toolbox);

