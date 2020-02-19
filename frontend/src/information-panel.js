require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;

class InformationPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tileProviderId: 'esri'
        };
    }

    componentDidMount() {
    }
    
    componentDidUpdate(prevProps, prevState) {
    }

    render() {
        return (
            <div class='col-4 padding-0' style={{backgroundColor: 'blue'}}>
                {this.props.information}    
            </div>
        );
    }
}



export default InformationPanel;

