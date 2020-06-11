const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import { connect }          from 'react-redux';

import {axiosAuth} from './axios-setup.js';


import {CancelToken} from 'axios';

import {Nav} from 'react-bootstrap';

import L from 'leaflet';

require('./css/information-panel.css');
import TargetDataPane       from './target-data-pane.jsx';
import TargetPhotoPane      from './target-photo-pane.jsx';
import TargetMetadataPane   from './target-metadata-pane.jsx';
import TargetAdjustmentPane from './target-adjustment-pane.jsx';

import {displayModal
      , toggleMaximizeInfoPanel
      , setPaneToOpenInfoPanel
      , setTreeInfoCurrent
      , setTreeInfoOriginal
      , getFeatNumPhotos
      , getFeatData
      , saveFeatData}  from './redux/actions/index.js';



import {INFORMATION, PHOTOS, HISTORY, ADJUST} from './constants/information-panel-panes.js';
import {MDL_NOTIFICATION, MDL_NOTIFICATION_NO_DISMISS} from './constants/modal-types.js';



import wrapContexts from './context/contexts-wrapper.jsx';

import {LOGGING_IN
      , LOADING_TREE_DATA // todo: not used any more - clear junk
      , SAVING_TREE_DATA} from './constants/information-panel-tree-server-call-types.js';

import {msgTreeDataIsDirty, displayNotificationIfTargetIsDirty} from './common.jsx';

import {GSN, globalGet} from './globalStore.js';
import {areEqualShallow, sca_fake_return} from './util/util.js';

import {targetIsDirty
      , targetInitialAjaxReadInProgress
      , typeOfTargetInitialAjaxReadInProgress} from './redux/selectors.js';

const loading  = require('./resources/loading.gif');


const mapStateToProps = (state) => {
  return {
    maximizedInfoPanel: state.maximizedInfoPanel
    , targetId: state.target.id
    , targetIsDirty: targetIsDirty(state)
    , tab: state.paneToOpenInfoPanel
    , treeInfo: state.target.treeInfo
    , photos: state.target.photos
    , targetInitialAjaxReadInProgress: targetInitialAjaxReadInProgress(state)
    , typeOfTargetInitialAjaxReadInProgress: typeOfTargetInitialAjaxReadInProgress(state)
  };
};


const mapDispatchToProps = (dispatch) => {
  return {dispatch};
}


// refid: SSE-1589888176
const mergeProps = ( stateProps, {dispatch}) => {
  const msgTreeDataHasBeenUpdated = targetId => `τα νέα δεδομένα για το δένδρο #${targetId} αποθηκεύτηκαν`;
  const msgSavingTreeData = targetId => `αποθήκευση δεδομένων για το δένδρο #${targetId}`;
  return {
    ...stateProps
    , getFeatData:(id) => dispatch(getFeatData(id))
    , saveFeatData: (treeInfo) => dispatch(saveFeatData(treeInfo))
    , displayTreeDataHasBeenUpdated: (targetId)=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataHasBeenUpdated(targetId)}))
    , displayModalSavingTreeData  : ()=>dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msgSavingTreeData(stateProps.targetId)}))
    , toggleMaximizeInfoPanel: ()=>dispatch(toggleMaximizeInfoPanel())
    , setPaneToOpenInfoPanelAndPossiblyFetchPhoto: (pane) => {
      dispatch(setPaneToOpenInfoPanel(pane))
      if (stateProps.photos===null) {
        dispatch(getFeatNumPhotos(stateProps.targetId));
      }
    }
    , setPaneToOpenInfoPanelAndPossiblyFetchData: (pane) => {
      dispatch(setPaneToOpenInfoPanel(pane))
      if (stateProps.treeInfo===null) {
        dispatch(getFeatData(stateProps.targetId));
      }
    }    
    , displayNotificationTargetIsDirty  : ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataIsDirty(stateProps.targetId)}))
    , setTreeInfoCurrent: (treeInfo) => dispatch(setTreeInfoCurrent (treeInfo))
  };
}

class TreeInformationPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.source = CancelToken.source();
  }

  shouldComponentUpdate(nextProps) {
    return !areEqualShallow(this.props, nextProps);
    }


  getInitialState = () => {
    return {
      error: null
    };
  }

  displayNotificationIfTargetIsDirty = displayNotificationIfTargetIsDirty.bind(this);
  

  targetId2Marker = (targetId) => {
    return globalGet(GSN.REACT_MAP).id2marker[targetId];
  }
  
  handleSubmit = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.saveFeatData(this.props.treeInfo);
  }

  fetchTreeDataIfNecessary = () => {
      if (this.props.treeInfo == null)
        this.props.getFeatData(this.props.targetId);
  }


  onInformation = () => {
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchData(INFORMATION);
    }
  }

  onPhotos = () => {
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchPhoto(PHOTOS);
    }
  }

  onHistory = () => {
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchData(HISTORY);
    }
  }

  onAdjust = () => {
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchData(ADJUST);
    }
  }
  
  

  render() {
    if (this.props.targetId===null) {
      return (
        <div id='detailInformation' className='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
          click on a feature to see its information
        </div>
      );
    } else {
      console.log(`tab is  ${this.props.tab}, targetId is: ${this.props.targetId}`);
      const defaultClasses = {'nav-link': true};
      const informationClasses = Object.assign({}, defaultClasses, {'active': this.props.tab===INFORMATION});
      const photoClasses = Object.assign({}, defaultClasses, {'active': this.props.tab===PHOTOS});
      const historyClasses = Object.assign({}, defaultClasses, {'active': this.props.tab===HISTORY});
      const adjustClasses = Object.assign({}, defaultClasses, {'active': this.props.tab===ADJUST});      

      const paneToDisplay = this.paneToDisplay();
      const toggleTxt = this.props.maximizedInfoPanel?'Ελαχιστοποίηση':'Μεγιστοποίηση';
      const klasses = Object.assign({'padding-0': true}
                                  , {'col-4': !this.props.maximizedInfoPanel, 'col-12': this.props.maximizedInfoPanel});

      const tagReal = (<div className='col-6' style={{fontSize: '130%'}}>
          info on&nbsp;
          <span style={{fontFamily: 'monospace'}}>{this.props.targetId}</span>
      </div>);
      const tagDummy = (<div className='col-6' style={{fontSize: '130%'}}>
          Tag #
          <span style={{fontFamily: 'monospace'}}>198305193817</span>
      </div>);
      const heightStyle = {height: `${this.getInformationPanelHeight()}px`, overflow: 'scroll'};

      return (
        <div id='detail-information' className={cx(klasses)} style={Object.assign({}, heightStyle, {backgroundColor: 'lightgrey'})}>
          <div className='row' style={{marginLeft: 0, marginRight: 0}}>
            {tagReal}
            <div className='col-6'>
              <a id='toggle-info-panel' className={cx(defaultClasses)} href="#" onClick={this.props.toggleMaximizeInfoPanel}>{toggleTxt}</a>
            </div>
          </div>

        <Nav variant='pills' activeKey={this.props.tab} justify={true}
            onSelect={(selectedKey) => {
                     switch (selectedKey) {
                       case INFORMATION:
                         this.onInformation();
                         break;
                       case PHOTOS:
                         this.onPhotos();
                         break;
                       case HISTORY:
                         this.onHistory();
                         break;
                       case ADJUST:
                         this.onAdjust();
                         break;
                       default:
                         throw `unhandled key: ${selectedKey}`;
                     }
                     }
                     }
        >
        <Nav.Item>
          <Nav.Link eventKey={INFORMATION}>Γενικά</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={PHOTOS}>Φωτό</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={HISTORY}>Ιστορικό</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={ADJUST}>Μετατόπιση</Nav.Link>
        </Nav.Item>
        </Nav>
          
          {paneToDisplay}
        </div>
      );
    }
  }

  getInformationPanelHeight = () => {
    return this.props.geometryContext.screen.height - this.props.geometryContext.geometry.headerBarHeight
  }

  paneToDisplay = () => {
    if (this.props.targetInitialAjaxReadInProgress) {
      const spinner = <img src={loading} className='img-fluid'/>;
      switch (this.props.typeOfTargetInitialAjaxReadInProgress) {
        case 'feat-data-retrieval':
          return (
            <>
            {spinner}
            <div>retrieving data of feature {this.props.targetId} &hellip;</div>
            </>
          );
        case 'feat-num-photos-retrieval':
          return (
            <>
            {spinner}
            <div>retrieving # of photos of feature {this.props.targetId} &hellip;</div>
            </>
          );
        case 'feat-photo-retrieval':
          assert.isDefined(this.props.photos.num);
          assert.isDefined(this.props.photos.idx);
          return (
            <>
            {spinner}
            <div>retrieving photo {this.props.photos.idx + 1} (of {this.props.photos.num})
              of feature {this.props.targetId} &hellip;</div>
            </>
          );
        default:
          assert.fail(`snafu in information-panel-tree.jsx :: unrecognized pane: [${this.props.typeOfTargetInitialAjaxReadInProgress}]`);
          return sca_fake_return();
      } // switch
    } else {
      switch (this.props.tab) {
        case INFORMATION:
          return (
            <TargetDataPane />
          );
        case PHOTOS:
          return <TargetPhotoPane/>
        case HISTORY:
          return (
            <TargetMetadataPane/>
          );
        case ADJUST: {
          return <TargetAdjustmentPane />;
        }
        default:
          assert.fail(`information-panel-tree.jsx :: paneToDisplay ~ unhandled case: [${this.props.tab}]`);
          return null; // SCA
      }
    } // else
  } // paneToDisplay
} // class



export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(wrapContexts(TreeInformationPanel));

