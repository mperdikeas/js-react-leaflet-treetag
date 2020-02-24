require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;


export default class TargetMetadataPane extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            payload: null,
            error: null
        };
    }

    componentDidMount() {
    }
    
    componentDidUpdate(prevProps, prevState) {
    }


    render() {
        return (
            <div>
                metadata on {this.props.targetId}
            </div>
        );
    }
}
