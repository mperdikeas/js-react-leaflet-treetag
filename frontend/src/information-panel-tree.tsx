import React, {Dispatch} from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {Nav} from 'react-bootstrap';
import cx from 'classnames';


import chai from './util/chai-util.js';
const assert = chai.assert;
require('./css/information-panel.css');
import TargetDataPane       from './target-data-pane.tsx';
import TargetPhotoPane      from './target-photo-pane.jsx';
import TargetMetadataPane   from './target-metadata-pane.jsx';
import TargetAdjustmentPane from './target-adjustment-pane.jsx';

import {displayModalNotification
      , toggleMaximizeInfoPanel
      , setPaneToOpenInfoPanel
      , setTreeInfoCurrent

      , getFeatNumPhotos
      , getFeatData
      , saveFeatData}  from './redux/actions/index.ts';

import {RootState} from './redux/types.ts';

import {TreeInfoWithId} from './backend.d.ts';
import wrapContexts from './context/contexts-wrapper.tsx';


import {msgTreeDataIsDirty, displayNotificationIfTargetIsDirty} from './common.jsx';

import {GSN, globalGet} from './globalStore.js';
import {areEqualShallow, sca_fake_return} from './util/util.js';

import {targetIsDirty
      , targetInitialAjaxReadInProgress
      , typeOfTargetInitialAjaxReadInProgress} from './redux/selectors.ts';

const loading  = require('./resources/loading.gif');


type StateProps = {
  maximizedInfoPanel: boolean,
  targetId: number | null,
  targetIsDirty: boolean,
  tab: string,
  treeInfo: any, // TODO
  photos: any, // TODO
  targetInitialAjaxReadInProgress: boolean,
  typeOfTargetInitialAjaxReadInProgress: string
};


const mapStateToProps: (state: RootState)=>StateProps = (state) => {
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


const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {dispatch};
}


export enum InformationPanelPane {
    INFORMATION = 'INFORMATION',
    PHOTOS      = 'PHOTOS',
    HISTORY     = 'HISTORY',
    ADJUST      = 'ADJUST'
};


// refid: SSE-1589888176
const mergeProps = ( stateProps: StateProps, {dispatch}: {dispatch: Dispatch<any>}) => {
  const msgTreeDataHasBeenUpdated = (targetId: number) => `τα νέα δεδομένα για το δένδρο #${targetId} αποθηκεύτηκαν`;

  return {
    ...stateProps
    , getFeatData:(id: number) => dispatch(getFeatData(id))
    , saveFeatData: (treeInfo: TreeInfoWithId) => dispatch(saveFeatData(treeInfo))
    , displayTreeDataHasBeenUpdated: (targetId: number)=>dispatch(displayModalNotification(msgTreeDataHasBeenUpdated(targetId)))
    , toggleMaximizeInfoPanel: ()=>dispatch(toggleMaximizeInfoPanel())
    , setPaneToOpenInfoPanelAndPossiblyFetchPhoto: (pane: InformationPanelPane) => {
      dispatch(setPaneToOpenInfoPanel(pane))
      if (stateProps.photos===null) {
        dispatch(getFeatNumPhotos(stateProps.targetId!));
      }
    }
    , setPaneToOpenInfoPanelAndPossiblyFetchData: (pane: InformationPanelPane) => {
      dispatch(setPaneToOpenInfoPanel(pane))
      if (stateProps.treeInfo===null) {
        dispatch(getFeatData(stateProps.targetId!));
      }
    }    
    , displayNotificationTargetIsDirty  : ()=>dispatch(displayModalNotification(msgTreeDataIsDirty(stateProps.targetId)))
    , setTreeInfoCurrent: (treeInfo: TreeInfoWithId) => dispatch(setTreeInfoCurrent (treeInfo))
  };
}

const connector = connect(mapStateToProps, mapDispatchToProps, mergeProps);

type PropsFromRedux = ConnectedProps<typeof connector> & {geometryContext: any} // TODO find way to obtain props from context or remove geometry context altogether

class TreeInformationPanel extends React.Component<PropsFromRedux, never> {

  constructor(props: PropsFromRedux) {
    super(props);
  }

  shouldComponentUpdate(nextProps: PropsFromRedux) {
    return !areEqualShallow(this.props, nextProps);
    }

  displayNotificationIfTargetIsDirty = displayNotificationIfTargetIsDirty.bind(this);
  

  targetId2Marker = (targetId: number) => {
    return globalGet(GSN.REACT_MAP).id2marker[targetId];
  }
  
  onInformation = () => {
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchData(InformationPanelPane.INFORMATION);
    }
  }

  onPhotos = () => {
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchPhoto(InformationPanelPane.PHOTOS);
    }
  }

  onHistory = () => {
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchData(InformationPanelPane.HISTORY);
    }
  }

  onAdjust = () => {
    if (!this.displayNotificationIfTargetIsDirty()) {
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchData(InformationPanelPane.ADJUST);
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

      const paneToDisplay = this.paneToDisplay();
      const toggleTxt = this.props.maximizedInfoPanel?'Ελαχιστοποίηση':'Μεγιστοποίηση';
      const klasses = Object.assign({'padding-0': true}
                                  , {'col-4': !this.props.maximizedInfoPanel, 'col-12': this.props.maximizedInfoPanel});

      const tagReal = (<div className='col-6' style={{fontSize: '130%'}}>
          info on&nbsp;
          <span style={{fontFamily: 'monospace'}}>{this.props.targetId}</span>
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
             onSelect={(selectedKey: any) => {
               switch (selectedKey) {
                 case InformationPanelPane.INFORMATION:
                   this.onInformation();
                   break;
                 case InformationPanelPane.PHOTOS:
                   this.onPhotos();
                   break;
                 case InformationPanelPane.HISTORY:
                   this.onHistory();
                   break;
                 case InformationPanelPane.ADJUST:
                   this.onAdjust();
                   break;
                 default:
                   throw `unhandled key: ${selectedKey}`;
               }
             }
             }
        >
        <Nav.Item>
          <Nav.Link eventKey={InformationPanelPane.INFORMATION}>Γενικά</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={InformationPanelPane.PHOTOS}>Φωτό</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={InformationPanelPane.HISTORY}>Ιστορικό</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={InformationPanelPane.ADJUST}>Μετατόπιση</Nav.Link>
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
          assert.fail(`snafu in information-panel-tree.tsx :: unrecognized pane: [${this.props.typeOfTargetInitialAjaxReadInProgress}]`);
          return sca_fake_return();
      } // switch
    } else {
      switch (this.props.tab) {
        case InformationPanelPane.INFORMATION:
          return (
            <TargetDataPane />
          );
        case InformationPanelPane.PHOTOS:
          return <TargetPhotoPane/>
        case InformationPanelPane.HISTORY:
          return (
            <TargetMetadataPane/>
          );
        case InformationPanelPane.ADJUST: {
          return <TargetAdjustmentPane />;
        }
        default:
          assert.fail(`information-panel-tree.tsx :: paneToDisplay ~ unhandled case: [${this.props.tab}]`);
          return null; // SCA
      }
    } // else
  } // paneToDisplay
} // class



export default connector(wrapContexts(TreeInformationPanel));

