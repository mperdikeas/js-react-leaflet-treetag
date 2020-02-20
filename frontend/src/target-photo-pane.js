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
        console.log(`render(), payload is: ${this.state.payload}`);
        if (this.state.loading) {
            return (
                    <img src={loading} class='img-fluid' alt='Please wait...'/>
            );

        } else {
            if (this.state.error===null) {
                console.log('retrieved data successfully');
                console.log(Object.keys(this.state.payload));
                console.log(this.state);
                console.log(this.state.payload);
                return (
                        <>
                        photo information on {this.props.targetId}
                        <img src={`data:image/jpg;base64,${this.state.payload}`} class='img-fluid' alt='Responsive image'/>
                        </>
                );
            } else {
                return (
                        <>
                        <div>
                        shit happened: {this.state.error.message}
                    </div>
                        <div>
                        Full stack trace (for your sick perusal) follows:
                    </div>
                        <div style={{height: 500, color: 'red', background: 'yellow', overflowY: 'scroll'}}>
                        {this.state.error.strServerTrace}
                    </div>
                        </>
                );
            }
        }
    }

        fetchPayload() {
            console.log('fetchPayload');
            const targetId = Math.round(this.props.targetId*1000);
            const url = `https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/feature/${targetId}/photo`;
            console.log(`axios URL is: ${url}`);
            axios.get(url)
                .then(res => {
                    console.log(res);
                    const {t, err} = res.data; // this is a ValueOrInternalServerExceptionData data type on the server side
                    if (err===null) {
                        this.setState({ loading: false, payload: t, error: null});
                    } else {
                        this.setState({ loading: false, payload: null, error: err});
                    }
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

