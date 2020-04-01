require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;


const loading  = require('./resources/loading.gif');
// require('../resources/down-arrow.png');
import DownArrow from './resources/down-arrow.png';
// const download = url('../resources/
import {sca_fake_return} from './util.js';


import {axiosAuth} from './axios-setup.js';


// REDUX
import { connect } from 'react-redux';

import {MODAL_LOGIN} from './constants/modal-types.js';

import {displayModal} from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    targetId: state.targetId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayModalLogin: (func)  => {
      console.log('asdfasdfasdf');
      const modalProps = {f: func};
      console.log('xxxxxxxxxx '+JSON.stringify(modalProps));
      dispatch(displayModal(MODAL_LOGIN, modalProps));

      }
    };
  }




class TargetPhotoPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      loadingNumOfPhotos: true
      , loadingPhoto    : false
      , numOfPhotos     : null
      , currentPhotoIndx: null
      , photoBase64     : null
      , photoBase64Instant     : null                
      , error           : null};
    /*
     *    error objects will have the following shape:
     *    {message, details}
     */
  }

  prevImage = () => {
    this.setState({loadingPhoto: true
                 , currentPhotoIndx: this.state.currentPhotoIndx-1
                 , photoBase64: null});
  }
  
  nextImage = () => {
    this.setState({loadingPhoto: true
                 , currentPhotoIndx: this.state.currentPhotoIndx+1
                 , photoBase64: null});
  }    

  componentDidMount() {
    console.log('componentDidMount');
    this.fetchNumOfPhotos();
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
    if (false) {
    if (prevProps.targetId !== this.props.targetId) {
      this.setState(this.getInitialState());
      this.fetchNumOfPhotos();
    } else if ((prevState.currentPhotoIndx !== this.state.currentPhotoIndx)
               && (this.state.currentPhotoIndx!=null))
      this.fetchPhoto();
    }
    if (prevProps.targetId !== this.props.targetId) {
      this.setState(this.getInitialState());
    } else if (this.state.loadingNumOfPhotos) {
      this.fetchNumOfPhotos();
    } else if (this.state.loadingPhoto) {
      this.fetchPhoto();
    }
  }

  render() {
    if (this.state.loadingNumOfPhotos) {
      return (
        <>
        <img src={loading} className='img-fluid' alt='Retrieving # of photos...'/>
        <div>Retrieving number of photos</div>
        </>
        );

    } else if (this.state.loadingPhoto) {
      return (
        <>
        <img src={loading} className='img-fluid' alt='Retrieving photo ...'/>
        <div>Retrieving photo</div>
        </>
        );
    } else {
      console.log('not loading state');
      const {numOfPhotos, currentPhotoIndx, photoBase64, photoBase64Instant} = this.state;
      if (this.state.error===null) {

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
            const style = {cursor: `url(${DownArrow})`};
            return (
              <>
              <a href={`data:image/gif;base64,${photoBase64}`} download="tree-photo.jpg" style={style}>
                <img src={`data:image;base64,${photoBase64}`} className='img-fluid' alt='Responsive image' style={style}/>
              </a>
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
        const divActualDate = (<div>photo of {this.props.targetId} taken on {photoBase64Instant.seconds}</div>);
        const divDummyDate = (<div>Ημερομηνία λήψης 2019-10-03</div>);
        const prevNextStyle = {fontSize: 18, fontWeight: 'bold'};
        return (
          <>
          {divActualDate}
          <div className='d-flex flex-row justify-content-between'>
            <button type="button" disabled={firstImage} className={cx(prevButtonClasses)} style={prevNextStyle} onClick={this.prevImage}>&lt;</button>
            Φωτό {currentPhotoIndx+1} από {numOfPhotos}
            <button type="button" disabled={lastImage} className={cx(nextButtonClasses)} style={prevNextStyle} onClick={this.nextImage}>&gt;</button>
          </div>
          {imageDiv}
          </>
        );
      } // if (this.state.error===null) {
      else {
        return (
          <>
          <div>
            shit happened: {this.state.error.message}
          </div>
          <div>
            Full stack trace (for your sick perusal) follows:
          </div>
          <div style={{height: 500, color: 'red', background: 'yellow', overflowY: 'scroll'}}>
            {this.state.error.details}
          </div>
          </>
        );
      }
    }
  }

  fetchNumOfPhotos = () => {
    console.log('fetchNumOfPhotos');
    const url = urlForNumOfPhotos(this.props.targetId);
    console.log(`fetchNumOfPhotos, axios URL is: ${url}`);
    axiosAuth.get(url
    ).then(res => {
      /* SSE-1585746250
       * This is a ValueOrInternalServerExceptionData data type on the server side
       *
       * public class InternalServerExceptionData {
       *
       *    public final String message;
       *    public final String strServerTrace;
       * ...
       */            

      const {t, err} = res.data; 
      if (err===null) {
        const numOfPhotos = t;
        const currentPhotoIndx = numOfPhotos>0?0:null;
        this.setState({ loadingNumOfPhotos: false
                      , loadingPhoto: numOfPhotos>0
                      , numOfPhotos: numOfPhotos
                      , currentPhotoIndx: currentPhotoIndx
                      , photoBase64: null
                      , error: null});
      } else {
        this.setState({ loadingNumOfPhotos: false
                      , numOfPhotos: null
                      , error: {message: `server-side error: ${err.message}`
                              , details: err.strServerTrace}});
      }
    }).catch( err => {
      console.log(JSON.stringify(err));
      console.log(err);
      if (err.response && err.response.data) {
        /* SSE-1585746388
         * Here the shape of the error response is {code, msg}
         * final class ValidJWSAccessTokenFilter#AbortResponse {
         *    public final String code;
         *    public final String msg;
         *  ...
         */
        switch(err.response.data.code) {
          case 'JWT-verif-failed':
            this.props.displayModalLogin( ()=>{this.fetchNumOfPhotos();} );
            this.setState({loadingNumOfPhotos: false
                         , error: {message: 'JWT verif. failed (likely expired?)'
                                 , details: err.response.data.msg}});
            break;
          default:
            this.setState({loadingNumOfPhotos: false
                         , error: {message: 'unexpected error code'
                                 , details: `unexpected error code: ${err.response.data.code}, msg=${err.response.data.msg}`}});
        }
      } else {
        this.setState({loadingNumOfPhotos: false
                     , error: {message: 'unexpected error - likely a bug'
                             , details: JSON.stringify(err)}});
      }
    });
  } // fetchNumOfPhotos
  
  fetchPhoto = () => {
    console.log('fetchPhoto');
    const url = urlForPhoto(this.props.targetId, this.state.currentPhotoIndx);
    axiosAuth.get(url
      //            , {headers: createAxiosAuthHeader()}
    ).then(res => {
      console.log(res);
      const {t: {photoBase64, instant}, err} = res.data; // corr-id: SSE-1585746250
      if (err===null) {
        this.setState({ loadingPhoto: false, photoBase64: photoBase64, photoBase64Instant: instant, error: null});
      } else {
        this.setState({ loadingPhoto: false
                      , photoBase64: null
                      , error: {message: err.message
                              , details: err.strServerTrace}});
      }
    }).catch( err => {
      console.log(err);
      if (err.response && err.response.data) {
        // corr-id: SSE-1585746388
        switch(err.response.data.code) {
          case 'JWT-verif-failed':
            console.log('case JWT-verif-failed');
            this.props.displayModalLogin( ()=>{this.fetchPhoto();});
            this.setState({loadingPhoto: false
                         , error: {message: 'JWT verif. failed (likely expired?)'
                                 , details: err.response.data.msg}});
            break;
          default:
            this.setState({loadingPhoto: false
                         , error: {message: 'unexpected error code'
                                 , details: `unexpected error code: ${err.response.data.code}, msg=${err.response.data.msg}`}});
        }
      } else {
        this.setState({loadingPhoto: false
                     , error: {message: 'unexpected error - likely a bug'
                             , details: JSON.stringify(err)}});
      }
    });
  }
} // class

function uuidToNumber(uuid) {
  return uuid.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}


function urlForPhoto(targetId, indx) {
  const effectiveTargetId = Math.abs(uuidToNumber(targetId));
  const url = `/feature/${effectiveTargetId}/photos/elem/${indx}`;
  return url;
}


function urlForNumOfPhotos(targetId) {
  const effectiveTargetId = Math.abs(uuidToNumber(targetId));
  const url=`/feature/${effectiveTargetId}/photos/num`;
  return url;
}


export default connect(mapStateToProps, mapDispatchToProps)(TargetPhotoPane);
