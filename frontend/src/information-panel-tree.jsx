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
      , clearModal
      , toggleMaximizeInfoPanel
      , setPaneToOpenInfoPanel
      , setTreeInfoCurrent
      , setTreeInfoOriginal
      , getFeatNumOfPhotos
      , getFeatData
      , saveFeatData}  from './redux/actions/index.js';



import {INFORMATION, PHOTOS, HISTORY, ADJUST} from './constants/information-panel-panes.js';
import {MDL_NOTIFICATION, MDL_NOTIFICATION_NO_DISMISS, MODAL_LOGIN} from './constants/modal-types.js';



import wrapContexts from './context/contexts-wrapper.jsx';

import {LOGGING_IN
      , LOADING_TREE_DATA // todo: not used any more - clear junk
      , SAVING_TREE_DATA} from './constants/information-panel-tree-server-call-types.js';

//import {OP_NO_LONGER_RELEVANT} from './constants/axios-constants.js';
import {msgTreeDataIsDirty, displayNotificationIfTargetIsDirty} from './common.jsx';
import {possiblyInsufPrivPanicInAnyCase, isInsufficientPrivilleges} from './util-privilleges.js';

import {GSN, globalGet} from './globalStore.js';
import {areEqualShallow, sca_fake_return} from './util/util.js';

import {targetIsDirty
      , targetAjaxReadInProgress
      , typeOfTargetAjaxReadInProgress} from './redux/selectors.js';

const loading  = require('./resources/loading.gif');


const mapStateToProps = (state) => {
  return {
    maximizedInfoPanel: state.maximizedInfoPanel
    , targetId: state.target.id
    , targetIsDirty: targetIsDirty(state)
    , tab: state.paneToOpenInfoPanel
    , photos: state.target.photos
    , targetAjaxReadInProgress: targetAjaxReadInProgress(state)
    , typeOfTargetAjaxReadInProgress: typeOfTargetAjaxReadInProgress(state)
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
    , getFeatData:(id, cancelToken) => dispatch(getFeatData(id, cancelToken))
    , saveFeatData: (treeInfo) => dispatch(saveFeatData(treeInfo))
    , displayModalLogin: (func)  => dispatch(displayModal(MODAL_LOGIN, {followUpFunction: func})) // TODO: obsolete
    , displayNotificationInsufPrivilleges: ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgInsufPriv1}))
    , displayTreeDataHasBeenUpdated: (targetId)=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataHasBeenUpdated(targetId)}))
    , displayModalSavingTreeData  : ()=>dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msgSavingTreeData(stateProps.targetId)}))
    , clearModal : () => dispatch(clearModal())
    , toggleMaximizeInfoPanel: ()=>dispatch(toggleMaximizeInfoPanel())
    , setPaneToOpenInfoPanel: (pane) => dispatch(setPaneToOpenInfoPanel(pane))
    , setPaneToOpenInfoPanelAndPossiblyFetchPhoto: (pane) => {
      dispatch(setPaneToOpenInfoPanel(pane))
      if (stateProps.photos===null) {
        dispatch(getFeatNumOfPhotos(stateProps.targetId));
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
  
  componentDidMount() {
//    this.fetchData();
  }

  componentWillUnmount() {
    console.log('TreeInformationPanel: unmounting and cancelling requests...');
//    this.source.cancel(OP_NO_LONGER_RELEVANT);
  }

  
  componentDidUpdateDELME(prevProps, prevState) {
    if (prevProps.targetId !== this.props.targetId) {
      console.log('cancelling pending requests due to new target');
//      this.source.cancel(OP_NO_LONGER_RELEVANT);
//      this.source = CancelToken.source(); // cf. SSE-1589117399
//      this.fetchData();
    }
  }


  
  





  fetchDataDELME = () => {
    this.props.getFeatureData(this.props.targetId, this.source.token);
  /*
    const url = `/feature/${this.props.targetId}/data`;
    console.log(`fetchData, axios URL is: ${url}`);
    axiosAuth.get(url, {cancelToken: this.source.token}
    ).then(res => {
      // corr-id: SSE-1585746250
      console.log(res.data);
      const {t, err} = res.data;
      console.log(t);
      if (err===null) {
        this.props.setTreeInfoOriginal(t);
      } else {
        this.props.setTreeInfoOriginal(null);
        this.setState({error: {message: `server-side error: ${err.message}`
                              , details: err.strServerTrace}});
      }
    }).catch( err => {
      if (err.message === OP_NO_LONGER_RELEVANT) {
        console.log('fetchNumOfPhotos operation is no longer relevant and got cancelled');
      } else if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case 'JWT-verif-failed':
            this.props.displayModalLogin( ()=>{this.setState({error: null}); this.fetchData();} );
            this.props.setTreeInfoOriginal(null);
            this.setState({error: {message: `JWT verif. failed. Server message is: [${msg}] - waiting for user login`
                                 , details: details}});

            break;
          default:
            this.props.setTreeInfoOriginal(null);
            this.setState({error: {message: `unexpected error code: ${code}`
                                 , details: msg}});

        }
      } else {
        this.props.setTreeInfoOriginal(null);
        this.setState({
          error: {message: 'unexpected error - likely a bug'
                , details: JSON.stringify(err)}});

      }
    }) // catch
    */
  } // fetchData


  targetId2Marker = (targetId) => {
    return globalGet(GSN.REACT_MAP).id2marker[targetId];
  }
  
  handleSubmit = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.saveFeatData(this.props.treeInfo);
  }

  handleSubmitDELME = (ev) => {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    } else
    console.warn('weird ev in handleSubmit is null');
    /*
    console.log('handle submit');
    console.log(this.props.treeInfo);
    console.log(JSON.stringify(this.props.treeInfo));    
    // the post cannot be cancelled so we don't bother with a cancel token
//    this.setState({serverCallInProgress: SAVING_TREE_DATA});
    this.props.displayModalSavingTreeData();
    const self = this;
    axiosAuth.post(`/feature/${this.props.targetId}/data`, this.props.treeInfo).then(res => {
      console.log('in axios;:then');
      this.props.clearModal();
      this.setState({serverCallInProgress: null});
      if (res.data.err != null) {
        console.log(`/feature/${this.props.targetId}/data POST error`);
        assert.fail(res.data.err);
      } else {
        console.log('abc - API call success');
        const targetId = self.props.targetId;
        const markerInMainMap = self.targetId2Marker(targetId);
        const {latitude: lat, longitude: lng} = self.props.treeInfo.coords;
        const latlng = L.latLng(lat, lng);
        markerInMainMap.setLatLng(latlng);
        globalGet(GSN.REACT_MAP).adjustHighlightingMarker(latlng);


        const targAdjPane = globalGet(GSN.TARG_ADJ_PANE, false);
        if (targAdjPane) {
          targAdjPane.adjustMovableMarker(latlng);
        }
        console.log(res.data.t);
        this.props.displayTreeDataHasBeenUpdated(this.props.targetId);
        // this.props.dataIsNowSaved();
        this.props.setTreeInfoOriginal(this.props.treeInfo);
      }
    }).catch( err => {
      console.log('in axios;:catch');
      this.props.clearModal();
      this.setState({serverCallInProgress: null});
      if (isInsufficientPrivilleges(err)) {
        console.log('insuf detected');
        this.props.displayNotificationInsufPrivilleges();
      } else {
        if (err.response && err.response.data) {
          // SSE-1585746388: the shape of err.response.data is (code, msg, details)
          // Java class ValidJWSAccessTokenFilter#AbortResponse
          const {code, msg, details} = err.response.data;
          switch(code) {
            case 'JWT-verif-failed':
              this.props.displayModalLogin( ()=>{this.setState({error: null}); this.handleSubmit();});
              break;
            default: {
              console.error(err);
              assert.fail(`unexpected condition: code=${code}, msg=${msg}, details=${details}`);
            }
          }
        } else {
          console.trace();
          console.error(err);
          assert.fail(`unexpected condition: ${JSON.stringify(err)}`);
        }
      }
    });
    */
  }


  onInformation = () => {
    if (!this.displayNotificationIfTargetIsDirty())
      this.props.setPaneToOpenInfoPanel(INFORMATION);
  }

  onPhotos = () => {
    if (!this.displayNotificationIfTargetIsDirty())
      this.props.setPaneToOpenInfoPanelAndPossiblyFetchPhoto(PHOTOS);
  }

  onHistory = () => {
    if (!this.displayNotificationIfTargetIsDirty())
      this.props.setPaneToOpenInfoPanel(HISTORY);
  }

  onAdjust = () => {
    if (!this.displayNotificationIfTargetIsDirty())
      this.props.setPaneToOpenInfoPanel(ADJUST);
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
    if (this.state.error)
      return (
        <>
        <div>Σφάλμα</div>
        <div style={{color: 'red'}}>{JSON.stringify(this.state.error)}</div>
        </>
      );
    else if (this.props.targetAjaxReadInProgress) {
      const spinner = <img src={loading} className='img-fluid'/>;
      switch (this.props.typeOfTargetAjaxReadInProgress) {
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
            <div>retrieving photo {this.props.photos.idx} (of {this.props.photos.num})
              of feature {this.props.targetId} &hellip;</div>
            </>
          );
        default:
          assert.fail(`snafu in information-panel-tree.jsx :: unrecognized pane: [${this.props.typeOfTargetAjaxReadInProgress}]`);
          return sca_fake_return();
      } // switch
    } else {
      console.log('abd  - b');
      switch (this.props.tab) {
        case INFORMATION:
          return (
            <TargetDataPane />
          );
        case PHOTOS:
          console.log('abd - bbbb2');
          return <TargetPhotoPane/>
        case HISTORY:
          return (
            <TargetMetadataPane/>
          );
        case ADJUST: {
          return <TargetAdjustmentPane />;
        }
        default:
          assert.fail(`unhandled case [${this.props.tab}]`);
          return null; // SCA
      }
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(wrapContexts(TreeInformationPanel));

