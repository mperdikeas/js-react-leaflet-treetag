require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


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
            <div id='tree' class='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
                <ul class="nav">
                    <li class="nav-item">
                        <a class="nav-link active" href="#">Πληροφορίες</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Φωτογραφίες</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Ιστορικό</a>
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

