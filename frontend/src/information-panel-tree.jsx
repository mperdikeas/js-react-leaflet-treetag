const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

require('./css/information-panel.css');
import TargetDataPane     from './target-data-pane.jsx';
import TargetPhotoPane    from './target-photo-pane.jsx';
import TargetMetadataPane from './target-metadata-pane.jsx';

// REDUX
import { connect }          from 'react-redux';
import {toggleMaximizeInfoPanel, setPaneToOpenInfoPanel}  from './actions/index.js';
import {INFORMATION, PHOTOS, HISTORY} from './constants/information-panel-panes.js';
import {MODAL_LOGIN} from './constants/modal-types.js';

import {displayModal} from './actions/index.js';
import {axiosAuth} from './axios-setup.js';
import wrapContexts from './context/contexts-wrapper.jsx';

const mapStateToProps = (state) => {
  return {
    maximizedInfoPanel: state.maximizedInfoPanel
    , targetId: state.targetId
    , tab: state.paneToOpenInfoPanel
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMaximizeInfoPanel: ()=>dispatch(toggleMaximizeInfoPanel())
    , setPaneToOpenInfoPanel: (pane) => dispatch(setPaneToOpenInfoPanel(pane))
    , displayModalLogin: (func)  => dispatch(displayModal(MODAL_LOGIN, {followUpFunction: func}))
    };
}

class TreeInformationPanel extends React.Component {

  constructor(props) {
    console.log('InformationPanel:: constructor');
    super(props);
    this.state = this.getInitialState();
  }


  getInitialState = () => {
    return {
      userIsLoggingIn: false
      , loadingTreeData: true
      , treeData: null
      , treeDataMutated: false
      , error: null
    };
  }


  componentDidMount() {
    this.fetchData();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.targetId !== this.props.targetId) {
      console.log('targetId is different');
      this.fetchData();
    } else
    console.log('targetId is the same');
  }

  updateTreeData = (treeData) => {
    console.log('x');
    this.setState({treeData, treeDataMutated: true});
  }


  fetchData = () => {
    const url = `/feature/${this.props.targetId}/data`;
    console.log(`fetchData, axios URL is: ${url}`);
    this.setState({loadingTreeData: true});
    axiosAuth.get(url
    ).then(res => {
      // corr-id: SSE-1585746250
      console.log(res.data);
      const {t, err} = res.data;
      if (err===null) {
        console.log(t);
        this.setState({userIsLoggingIn: false
                     , loadingTreeData: false
                     , treeData: t
                     , error: null});
      } else {
        this.setState({ userIsLoggingIn: false
                      , loadingTreeData: false
                      , treeData: null
                      , error: {message: `server-side error: ${err.message}`
                              , details: err.strServerTrace}});
      }
    }).catch( err => {
      console.log(JSON.stringify(err));
      console.log(err);
      if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case 'JWT-verif-failed':
            this.props.displayModalLogin( ()=>{this.fetchData();} );
            this.setState({userIsLoggingIn: true
                         , loadingTreeData: false
                         , treeData: null
                         , error: {message: `JWT verif. failed. Server message is: [${msg}]`
                                 , details: details}});
            break;
          default:
            this.setState({userIsLoggingIn: false
                         , loadingTreeData: false
                         , treeData: null
                         , error: {message: `unexpected error code: ${code}`
                                 , details: msg}});
        }
      } else {
        this.setState({userIsLoggingIn: false
                     , loadingTreeData: false
                     , treeData: null
                     , error: {message: 'unexpected error - likely a bug'
                             , details: JSON.stringify(err)}});
      }
    }) // catch
  } // fetchData
  
  componentWillUnmount() {
    console.log('TreeInformationPanel: unmounting...');
  }

  onInformation = () => {
    this.props.setPaneToOpenInfoPanel(INFORMATION);
  }

  onPhotos = () => {
    this.props.setPaneToOpenInfoPanel(PHOTOS);
  }

  onHistory = () => {
    this.props.setPaneToOpenInfoPanel(HISTORY);
  }

  render() {
    console.log('information panel render');
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
    switch (this.props.tab) {
      case INFORMATION:
        return (
          <TargetDataPane
          userIsLoggingIn = {this.state.userIsLoggingIn}
          loadingTreeData = {this.state.loadingTreeData}
          treeData        = {this.state.treeData}
          treeDataMutated = {this.state.treeDataMutated}
          updateTreeData  = {this.updateTreeData}
          />
        );
      case PHOTOS:
        return <TargetPhotoPane/>
      case HISTORY:
        return (
          <TargetMetadataPane
          userIsLoggingIn = {this.state.userIsLoggingIn}
          loadingTreeData = {this.state.loadingTreeData}
          treeActions     = {this.state.treeData===null?null:this.state.treeData.treeActions}
          />
        );
      default:
        assert.fail(`unhandled case [${this.props.tab}]`);
        return null; // SCA
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(TreeInformationPanel));

