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
    };
}

class TreeInformationPanel extends React.Component {

  constructor(props) {
    console.log('InformationPanel:: constructor');
    super(props);
  }

  componentDidMount() {
  }
  
  componentDidUpdate(prevProps, prevState) {
  }

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
      return (
        <div id='detail-information' className={cx(klasses)} style={{backgroundColor: 'lightgrey'}}>
          <div className='row'>
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
  paneToDisplay = () => {
    switch (this.props.tab) {
      case INFORMATION:
        return (
          <TargetDataPane targetId={this.props.targetId}/>
        );
      case PHOTOS:
        return (
          <TargetPhotoPane targetId={this.props.targetId}/>                
        );
      case HISTORY:
        return (
          <TargetMetadataPane targetId={this.props.targetId}/>
        );
      default:
        assert.fail(`unhandled case [${this.props.tab}]`);
        return null; // SCA
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(TreeInformationPanel);

