const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import { connect }          from 'react-redux';

import {axiosAuth} from './axios-setup.js';


import {CancelToken} from 'axios';

require('./css/information-panel.css');
import TargetDataPane       from './target-data-pane.jsx';
import TargetPhotoPane      from './target-photo-pane.jsx';
import TargetMetadataPane   from './target-metadata-pane.jsx';
import TargetAdjustmentPane from './target-adjustment-pane.jsx';

import {toggleMaximizeInfoPanel, setPaneToOpenInfoPanel}  from './actions/index.js';
import {INFORMATION, PHOTOS, HISTORY, ADJUST} from './constants/information-panel-panes.js';
import {MDL_NOTIFICATION, MODAL_LOGIN} from './constants/modal-types.js';

import {displayModal} from './actions/index.js';


import wrapContexts from './context/contexts-wrapper.jsx';

import {LOGGING_IN, LOADING_TREE_DATA} from './constants/information-panel-tree-server-call-types.js';

import {OP_NO_LONGER_RELEVANT} from './constants/axios-constants.js';
import {msgTreeDataIsDirty, displayNotificationIfTargetIsDirty} from './common.jsx';


const mapStateToProps = (state) => {
  return {
    maximizedInfoPanel: state.maximizedInfoPanel
    , targetId: state.targetId
    , targetIsDirty: state.targetIsDirty
    , tab: state.paneToOpenInfoPanel
  };
};

const mapDispatchToProps = (dispatch) => {
  return {dispatch};
}

// refid: SSE-1589888176
const mergeProps = ( stateProps, {dispatch}) => {
  return {
    ...stateProps
    , toggleMaximizeInfoPanel: ()=>dispatch(toggleMaximizeInfoPanel())
    , setPaneToOpenInfoPanel: (pane) => dispatch(setPaneToOpenInfoPanel(pane))
    , displayModalLogin: (func)  => dispatch(displayModal(MODAL_LOGIN, {followUpFunction: func}))
    , displayNotificationTargetIsDirty  : ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataIsDirty(stateProps.targetId)}))    
    };
}

class TreeInformationPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.source = CancelToken.source();
  }


  getInitialState = () => {
    return {
      serverCallInProgress: LOADING_TREE_DATA
      , treeData: null
      , treeDataMutated: false // TODO: I likely don't need this anymore
      , error: null
    };
  }

  displayNotificationIfTargetIsDirty = displayNotificationIfTargetIsDirty.bind(this);
  
  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    console.log('TreeInformationPanel: unmounting and cancelling requests...');
    this.source.cancel(OP_NO_LONGER_RELEVANT);
  }

  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.targetId !== this.props.targetId) {
      console.log('cancelling pending requests due to new target');
      this.source.cancel(OP_NO_LONGER_RELEVANT);
      this.source = CancelToken.source(); // cf. SSE-1589117399
      this.fetchData();
    }
  }


  
  
  updateTreeData = (treeData) => {
    console.log('x');
    this.setState({treeData, treeDataMutated: true});
  }

  clearTreeDataMutatedFlag = () => {
    this.setState({treeDataMutated: false});
  }


  fetchData = () => {
    const url = `/feature/${this.props.targetId}/data`;
    console.log(`fetchData, axios URL is: ${url}`);
    this.setState({serverCallInProgress: LOADING_TREE_DATA});
    axiosAuth.get(url, {cancelToken: this.source.token}
    ).then(res => {
      // corr-id: SSE-1585746250
      console.log(res.data);
      const {t, err} = res.data;
      if (err===null) {
        console.log(t);
        this.setState({serverCallInProgress: null
                     , treeData: t
                     , error: null});
      } else {
        this.setState({ serverCallInProgress: null
                      , treeData: null
                      , error: {message: `server-side error: ${err.message}`
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
            this.props.displayModalLogin( ()=>{this.fetchData();} );
            this.setState({serverCallInProgress: LOGGING_IN
                         , treeData: null
                         , error: {message: `JWT verif. failed. Server message is: [${msg}]`
                                 , details: details}});
            break;
          default:
            this.setState({serverCallInProgress: null
                         , treeData: null
                         , error: {message: `unexpected error code: ${code}`
                                 , details: msg}});
        }
      } else {
        this.setState({serverCallInProgress: null
                     , treeData: null
                     , error: {message: 'unexpected error - likely a bug'
                             , details: JSON.stringify(err)}});
      }
    }) // catch
  } // fetchData
  

  onInformation = () => {
    if (!this.displayNotificationIfTargetIsDirty())
      this.props.setPaneToOpenInfoPanel(INFORMATION);
  }

  onPhotos = () => {
    if (!this.displayNotificationIfTargetIsDirty())
      this.props.setPaneToOpenInfoPanel(PHOTOS);
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
          <ul className="nav">
            <li className="nav-item">
              <a id='information' className={cx(informationClasses)} href="#" onClick={this.onInformation}>Πληροφορίες</a>
            </li>
            <li className="nav-item">
              <a id='photos' className={cx(photoClasses)} href="#" onClick={this.onPhotos}>
                Φωτογραφίες
              </a>
            </li>
            <li className="nav-item">
              <a id='history' className={cx(historyClasses)} href="#" onClick={this.onHistory}>Ιστορικό</a>
            </li>
            <li className="nav-item">
              <a id='adjust' className={cx(adjustClasses)} href="#" onClick={this.onAdjust}>Μετατόπιση</a>
            </li>            
          </ul>
          {paneToDisplay}
        </div>
      );
    }
  }

  getInformationPanelHeight = () => {
    return this.props.geometryContext.screen.height - this.props.geometryContext.geometry.headerBarHeight
  }

  paneToDisplay = () => {
    console.log(`displaying pane ${this.props.tab}`);
    switch (this.props.tab) {
      case INFORMATION:
        return (
          <TargetDataPane
              userIsLoggingIn = {this.state.serverCallInProgress == LOGGING_IN}
              loadingTreeData = {this.state.serverCallInProgress  == LOADING_TREE_DATA}
              treeData        = {this.state.treeData}
              treeDataMutated = {this.state.treeDataMutated}
              clearTreeDataMutatedFlag = {this.clearTreeDataMutatedFlag}
              updateTreeData  = {this.updateTreeData}
          />
        );
      case PHOTOS:
        return <TargetPhotoPane/>
      case HISTORY:
        return (
          <TargetMetadataPane
              userIsLoggingIn = {this.state.serverCallInProgress == LOGGING_IN}
              loadingTreeData = {this.state.serverCallInProgress  == LOADING_TREE_DATA}
              treeActions     = {this.state.treeData===null?null:this.state.treeData.treeActions}
          />
        );
      case ADJUST: {
        return <TargetAdjustmentPane/>;
      }
      default:
        assert.fail(`unhandled case [${this.props.tab}]`);
        return null; // SCA
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(wrapContexts(TreeInformationPanel));

