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
        this.fetchNumOfPhotos = this.fetchNumOfPhotos   .bind(this);
        this.fetchPhoto       = this.fetchPhoto         .bind(this);
        this.getInitialState  = this.getInitialState    .bind(this);
        this.state            = this.getInitialState();
    }

    getInitialState() {
        return {  numOfPhotos     : null
                , currentPhotoIndx: null
                , photoBase64     : null
                  , photoBase64Instant     : null                
                , error           : null};
    }

    componentDidMount() {
        this.fetchNumOfPhotos();
    }
    
    componentDidUpdate(prevProps, prevState) {
        console.log(`component did update got called`);
        if (prevProps.targetId !== this.props.targetId) {
            this.setState(this.getInitialState());
            this.fetchNumOfPhotos();
        } else if (prevState.currentPhotoIndx !== this.state.currentPhotoIndx)
            this.fetchPhoto();
    }

    render() {
        console.log(`render(), state is: ${this.state}`);
        if (this.state.photoBase64===null) {
            return (
                    <img src={loading} class='img-fluid' alt='Please wait...'/>
            );

        } else {

            const {numOfPhotos, currentPhotoIndx, photoBase64, photoBase64Instant: {seconds}} = this.state;
            if (this.state.error===null) {
                // by this point we expect photoBase64 but also numOfPhotos  and currentPhotoIndx to be retrieved                
                assert.isNotNull(numOfPhotos);
                assert.isNotNull(currentPhotoIndx);
                assert.isNotNull(photoBase64);
                assert.isNotNull(seconds);

                console.log(numOfPhotos, currentPhotoIndx, photoBase64, seconds);
                return (
                        <>
                        <div>photo of {this.props.targetId} taken on {seconds}</div>
                        <div>photo {currentPhotoIndx} of {numOfPhotos}</div>
                        <img src={`data:image;base64,${photoBase64}`} class='img-fluid' alt='Responsive image'/>
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

        fetchNumOfPhotos() {
            console.log('fetchNumOfPhotos');
            const targetId = Math.round(this.props.targetId*1000);
            const url = `https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/feature/${targetId}/photos/num`;
            console.log(`axios URL is: ${url}`);
            axios.get(url)
                .then(res => {
                    console.log(res);
                    const {t, err} = res.data; // this is a ValueOrInternalServerExceptionData data type on the server side
                    if (err===null) {
                        const numOfPhotos = t;
                        const currentPhotoIndx = numOfPhotos>0?1:0;
                        this.setState({ loading: false
                                        , numOfPhotos: numOfPhotos
                                        , currentPhotoIndx: currentPhotoIndx
                                        , error: null});
                    } else {
                        this.setState({ loading: false, numOfPhotos: null, error: err});
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
    
        fetchPhoto() {
            console.log('fetchPhoto');
            const targetId = Math.round(this.props.targetId*1000);
            const url = `https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/feature/${targetId}/photos/elem/${this.state.currentPhotoIndx}`;
            console.log(`axios URL is: ${url}`);
            axios.get(url)
                .then(res => {
                    console.log(res);
                    const {t: {photoBase64, instant}, err} = res.data; // this is a ValueOrInternalServerExceptionData data type on the server side
                    if (err===null) {
                        this.setState({ loading: false, photoBase64: photoBase64, photoBase64Instant: instant, error: null});
                    } else {
                        this.setState({ loading: false, photoBase64: null, error: err});
                    }
                }).catch( err => {
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

