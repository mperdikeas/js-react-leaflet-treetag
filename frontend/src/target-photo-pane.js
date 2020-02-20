require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;

const loading = require('../resources/loading.gif');
import axios from 'axios';


export default class TargetPhotoPane extends React.Component {

    constructor(props) {
        super(props);
        this.fetchPayload = this.fetchPayload.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {loading: true, payload: null, error: null};
    }

    componentDidMount() {
        this.fetchPayload();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.targetId !== this.props.targetId) {
            this.setState(this.getInitialState());
            this.fetchPayload();            
        }
    }

        render() {
            if (this.state.loading) {
                return (
                        <img src={loading} class='img-fluid' alt='Please wait...'/>
                );

            } else {
                return (
                        <div>
                        photo information on {this.props.targetId}
                        <img src='data:image/png;base64,iVBORw0K...' class='img-fluid' alt='Responsive image'/>
                        </div>
                );
            }
        }


        fetchPayload() {
            console.log('fetchPayload');
            const targetId = Math.round(this.props.targetId*1000);
            const url = `https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/feature/${targetId}/photo`;
            console.log(`axios URL is: ${url}`);
            axios.get(url)
                .then(res => {
                    this.setState({ loading: false, payload: 'foo', error: null});
                }).catch( err => {
                    console.log(JSON.stringify(err));
                    console.log(err);
                    switch(err.response.data.code) {
                    case 'JWT-verif-failed':
                        this.setState({loading: false
                                       , error: 'JWT verif. failed (likely expired?)'});
                        break;
                    default:
                        this.setState({loading: false
                                       , error: 'unexpected JWT verif. failure (likely a bug?)'});
                    }
                }
            );
        }
    }

