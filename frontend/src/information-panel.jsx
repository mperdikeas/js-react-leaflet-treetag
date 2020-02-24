require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;

require('./css/information-panel.css');
import TargetDataPane     from './target-data-pane.jsx';
import TargetPhotoPane    from './target-photo-pane.jsx';
import TargetMetadataPane from './target-metadata-pane.jsx';

class InformationPanel extends React.Component {

    constructor(props) {
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
        if (this.props.target===null)
            return (
            <div id='detailInformation' class='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
            click on a feature to see its information
            </div>
            );
        console.log(`tab is  ${this.state.tab}, targetId is: ${this.props.target.targetId}`);
        const defaultClasses = {'nav-link': true};
        const informationClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='information'});
        const photoClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='photos'});
        const historyClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='history'});

        const paneToDisplay = this.paneToDisplay();
        return (
            <div id='detail-information' class='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
                <div style={{fontSize: '130%'}}>info on&nbsp;
                    <span style={{fontFamily: 'monospace'}}>{this.props.target.targetId}</span>
                </div>
                <ul class="nav">
                    <li class="nav-item">
                        <a id='information' class={cx(informationClasses)} href="#" onClick={this.onInformation}>Πληροφορίες</a>
                    </li>
                    <li class="nav-item">
                        <a id='photos' class={cx(photoClasses)} href="#" onClick={this.onPhotos}>
                            Φωτογραφίες
                        </a>
                    </li>
                    <li class="nav-item">
                        <a id='history' class={cx(historyClasses)} href="#" onClick={this.onHistory}>Ιστορικό</a>
                    </li>
                </ul>
                {paneToDisplay}
            </div>
        );
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




export default InformationPanel;
