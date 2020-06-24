const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

//require('./toolbox.css');

import saveWorkspaceToDisk      from './resources/save-workspace-to-disk-32.png';
import uploadLayerToCloud       from './resources/upload-layer-to-cloud-32.png';
import insertGeoJSONToWorkspace from './resources/insert-geoJSON-to-workspace-32.png';
import selectTree               from './resources/select-tree-32.png';
import query                    from './resources/question-32.png';
import centerOnTarget           from './resources/target-32.png';

// redux
import { connect }                          from 'react-redux';
import {toggleMode, displayModal, addToast} from './redux/actions/index.ts';
import {targetIsDirty} from './redux/selectors.js';

import {MDL_NOTIFICATION
      , MDL_SAVE_WS_2_DSK
      , MDL_INS_GJSON_2_WS
      , MDL_QUERY} from './constants/modal-types.js';

import {GSN, globalGet} from './globalStore.js';

import {msgTreeDataIsDirty, displayNotificationIfTargetIsDirty} from './common.jsx';

const mapStateToProps = (state) => {
  return {
    targetId      : state.targetId,
    targetIsDirty: targetIsDirty(state)
  };
};


const mapDispatchToProps = (dispatch) => {
  return {dispatch};
}

// refid: SSE-1589888176
const mergeProps = ( stateProps, {dispatch}) => {
  return {
    ...stateProps
    , displayWorkspaceIsEmptyNotification: () => {
      const html = (<div style={{marginBottom: '1em'}}>Workspace layer has nothing to save</div>);
      dispatch(displayModal(MDL_NOTIFICATION, {html}));
    }
    , displayNotificationNoTargetSelected: ()=>{
      const html = <div style={{marginBottom: '1em'}}>Δεν έχει επιλεγεί κάποιο δένδρο</div>;
      dispatch(displayModal(MDL_NOTIFICATION, {html}));
    }
    , displayNotificationTargetIsDirty  : ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataIsDirty(stateProps.targetId)}))
    , saveWorkspaceToDisk: (geoJSON) => dispatch(displayModal(MDL_SAVE_WS_2_DSK, {geoJSON}))
    , insertGeoGSONToWorkspace: () => dispatch(displayModal(MDL_INS_GJSON_2_WS))
    , uploadLayerToCloud: () => dispatch(displayModal())
    , selectTree: ()=>{i++; dispatch(addToast(`header - ${i}`, 'this is some random toast'))}
    , query: ()=>dispatch(displayModal(MDL_QUERY))
    };
}

let i = 0;


class Toolbox extends React.Component {


  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
  }

  displayNotificationIfTargetIsDirty = displayNotificationIfTargetIsDirty.bind(this);


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
    const tools = [{icon:saveWorkspaceToDisk , f: this.saveWorkspaceToDisk}
                 , {icon:uploadLayerToCloud ,  f: this.chooseUploadLayerToCloud}
                 , {icon: insertGeoJSONToWorkspace, f: this.insertGeoJSONToWorkspace}
                 , {icon:selectTree, f: this.selectTree}
                 , {icon:query, f: this.query}
                 , {icon:centerOnTarget, f: this.centerOnTarget}
    ];
    

    const elems = tools.map( (el, idx) => {
      return (<ToolIcon
                 key = {idx}
                 isFirst = {idx===0}
                 onClick={el.f}
                 src={el.icon}
             />);
    });

    return (
      <div className='row no-gutters'>
        {elems}
      </div>
    );
  }
}

class ToolIcon extends React.PureComponent {


  constructor(props) {
    super(props);
    this.state = {hover: false};
  }

  baseStyle = () => {
    const style = {display: 'block'
                 , margin: 'auto'
                 , width: 40
                 , boxSizing: 'border-box'};
    const styleFirstIcon   = Object.assign({}, style, {marginTop: '100px'});
    const styleSubseqIcons = Object.assign({}, style, {marginTop: '10px'});
    return this.props.isFirst?styleFirstIcon:styleSubseqIcons
  }

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  }

  render = () => {
    const hoverStyle = {border: '3px dotted black'};
    const style = Object.assign(this.baseStyle(), this.state.hover?hoverStyle:{});
    return (
    <div className='col-12'>
      <a href='/' onClick={this.props.onClick}>
        <img src={this.props.src}
             style={style}
             onMouseEnter={this.toggleHover}
             onMouseLeave={this.toggleHover}/>
      </a>
    </div>
    );
  }
}
  


export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Toolbox);

