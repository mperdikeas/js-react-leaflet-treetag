require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

require('./css/information-panel.css');
import TargetDataPane     from './target-data-pane.jsx';
import TargetPhotoPane    from './target-photo-pane.jsx';
import TargetMetadataPane from './target-metadata-pane.jsx';

class TreeInformationPanel extends React.Component {

  constructor(props) {
    console.log('InformationPanel:: constructor');
    super(props);
    this.state = {
      tab: 'information'
    };
    this.onInformation = this.onInformation.bind(this);
    this.onPhotos      = this.onPhotos     .bind(this);
    this.onHistory     = this.onHistory    .bind(this);
    this.paneToDisplay = this.paneToDisplay.bind(this);
  }

  componentDidMount() {
  }
  
  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount() {
    console.log('TreeInformationPanel: unmounting...');
  }

  onInformation() {
    this.setState({tab: 'information'});
  }

  onPhotos() {
    this.setState({tab: 'photos'});
  }

  onHistory() {
    this.setState({tab: 'history'});
  }

  render() {
    if (this.props.target===null) {
      return (
        <div id='detailInformation' className='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
          click on a feature to see its information
        </div>
      );
    } else {
      console.log(`tab is  ${this.state.tab}, targetId is: ${this.props.target.targetId}`);
      const defaultClasses = {'nav-link': true};
      const informationClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='information'});
      const photoClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='photos'});
      const historyClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='history'});

      const paneToDisplay = this.paneToDisplay();
      const toggleTxt = this.props.maximized?'Ελαχιστοποίηση':'Μεγιστοποίηση';
      const klasses = Object.assign({'padding-0': true}
                                  , {'col-4': !this.props.maximized, 'col-12': this.props.maximized});
      return (
        <div id='detail-information' className={cx(klasses)} style={{backgroundColor: 'lightgrey'}}>
          <div className='row'>
            <div className='col-6' style={{fontSize: '130%'}}>
              info on&nbsp;
              <span style={{fontFamily: 'monospace'}}>{this.props.target.targetId}</span>
            </div>
            <div className='col-6'>
              <a id='toggle-info-panel' className={cx(defaultClasses)} href="#" onClick={this.props.toggleInfoPanel}>{toggleTxt}</a>
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
  paneToDisplay() {
    switch (this.state.tab) {
      case 'information':
        return (
          <TargetDataPane targetId={this.props.target.targetId}/>
        );
      case 'photos':
        return (
          <TargetPhotoPane targetId={this.props.target.targetId}/>                
        );
      case 'history':
        return (
          <TargetMetadataPane targetId={this.props.target.targetId}/>
        );
      default:
        assert.fail(`unhandled case [${this.state.tab}]`);
        return null; // SCA
    }
  }
}




export default TreeInformationPanel;

