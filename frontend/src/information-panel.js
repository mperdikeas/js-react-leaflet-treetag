require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;

require('./css/information-panel.css');

class InformationPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'information'
        };
        this.onInformation = this.onInformation.bind(this);
        this.onPhotos = this.onPhotos.bind(this);
        this.onHistory = this.onHistory.bind(this);
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
        console.log(`tab is now: ${this.state.tab}`);
        const defaultClasses = {'nav-link': true};
        const informationClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='information'});
        const photoClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='photos'});
        const historyClasses = Object.assign({}, defaultClasses, {'active': this.state.tab==='history'});
        return (
            <div id='tree' class='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
                <ul class="nav">
                    <li class="nav-item">
                        <a id='information' class={cx(informationClasses)} href="#" onClick={this.onInformation}>Πληροφορίες</a>
                    </li>
                    <li class="nav-item">
                        <a id='photos' class={cx(photoClasses)} href="#" onClick={this.onPhotos}>Φωτογραφίες</a>
                    </li>
                    <li class="nav-item">
                        <a id='history' class={cx(historyClasses)} href="#" onClick={this.onHistory}>Ιστορικό</a>
                    </li>
                </ul>
                <div>
                    {this.props.target.information}
                </div>
            </div>
        );
    }
}



export default InformationPanel;

