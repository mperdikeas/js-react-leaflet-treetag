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
        this.nextImage        = this.nextImage          .bind(this);
        this.prevImage        = this.prevImage          .bind(this);
        this.state            = this.getInitialState();
    }

    getInitialState() {
        return {  numOfPhotos     : null
                , currentPhotoIndx: null
                , photoBase64     : null
                  , photoBase64Instant     : null                
                , error           : null};
    }

    prevImage() {
        this.setState({currentPhotoIndx: this.state.currentPhotoIndx-1
                       , photoBase64: null});
    }
    
    nextImage() {
        this.setState({currentPhotoIndx: this.state.currentPhotoIndx+1
                       , photoBase64: null});
    }    

    componentDidMount() {
        this.fetchNumOfPhotos();
    }
    
    componentDidUpdate(prevProps, prevState) {
        console.log(`component did update got called`);
        if (prevProps.targetId !== this.props.targetId) {
            this.setState(this.getInitialState());
            this.fetchNumOfPhotos();
        } else if ((prevState.currentPhotoIndx !== this.state.currentPhotoIndx)
                   && (this.state.currentPhotoIndx!=null))
            this.fetchPhoto();
    }

    render() {
        console.log(`render(), state is: ${JSON.stringify(this.state)}`);
        if ((this.state.numOfPhotos === null) || ((this.state.numOfPhotos>0) && (this.state.photoBase64===null))) {
            return (
                    <img src={loading} class='img-fluid' alt='Please wait...'/>
            );

        } else {

            const {numOfPhotos, currentPhotoIndx, photoBase64, photoBase64Instant} = this.state;
            if (this.state.error===null) {

                console.log(numOfPhotos, currentPhotoIndx, photoBase64, photoBase64Instant);

                if ((numOfPhotos===0) && (photoBase64===null))
                    return (
                            <>
                                <div>no photos are available</div>
                            </>
                    );


                const imageDiv = (()=>{
                if ((numOfPhotos>0) && (photoBase64===null))
                    return (
                            <>
                                <div>fetching photo...</div>
                            </>
                    );
                    else {
                        return (
                        <>
                            <img src={`data:image;base64,${photoBase64}`} class='img-fluid' alt='Responsive image'/>
                        </>
                        );
                    }


                })();
                const buttonClasses = {
                    'btn': true,
                    'btn-outline-info': true
                };
                const firstImage = currentPhotoIndx===0;
                const lastImage = currentPhotoIndx===numOfPhotos-1;
                const prevButtonClasses = Object.assign({}, buttonClasses,
                                                        {
                                                            disabled: firstImage,
                                                            'not-allowed': firstImage
                                                        });
                const nextButtonClasses = Object.assign({}, buttonClasses,
                                                        {
                                                            disabled: lastImage,
                                                            'not-allowed':lastImage
                                                        });
                return (
                        <>
                        <div>photo of {this.props.targetId} taken on {photoBase64Instant.seconds}</div>
                        <div class='d-flex flex-row justify-content-between'>
                        <button type="button" disabled={firstImage} className={cx(prevButtonClasses)} onClick={this.prevImage}>prev</button>
                            photo {currentPhotoIndx+1} of {numOfPhotos}
                        <button type="button" disabled={lastImage} className={cx(nextButtonClasses)} onClick={this.nextImage}>next</button>
                        </div>
                        {imageDiv}
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
            console.log('entering fetchNumOfPhotos...');
            const targetId = Math.round(this.props.targetId*1000);
            const url = `https://127.0.0.1:8445/tree-cadaster-backend/jax-rs/main/feature/${targetId}/photos/num`;
            console.log(`axios URL is: ${url}`);
            axios.get(url)
                .then(res => {
                    console.log(res);
                    const {t, err} = res.data; // this is a ValueOrInternalServerExceptionData data type on the server side
                    if (err===null) {
                        const numOfPhotos = t;
                        const currentPhotoIndx = numOfPhotos>0?0:null;
                        console.log(`number of photos retrieved as ${numOfPhotos}`);
                        this.setState({ loading: false
                                        , numOfPhotos: numOfPhotos
                                        , currentPhotoIndx: currentPhotoIndx
                                        , photoBase64: null
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

