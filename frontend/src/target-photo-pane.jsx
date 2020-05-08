const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {Button} from 'react-bootstrap';

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

import {LOGGING_IN, GETTING_NUM_OF_PHOTOS, GETTING_PHOTO, DELETING_PHOTO} from './target-photo-pane-server-call-types.js';


  
const mapStateToProps = (state) => {
  return {
    targetId: state.targetId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displayModalLogin: (func)  => dispatch(displayModal(MODAL_LOGIN, {followUpFunction: func}))
  };
}




class TargetPhotoPane extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState = () => {
    return {
      serverCallInProgress: GETTING_NUM_OF_PHOTOS
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
    this.setState({serverCallInProgress: GETTING_PHOTO
                 , currentPhotoIndx: this.state.currentPhotoIndx-1
                 , photoBase64: null});
  }
  
  nextImage = () => {
    this.setState({serverCallInProgress: GETTING_PHOTO
                 , currentPhotoIndx: this.state.currentPhotoIndx+1
                 , photoBase64: null});
  }    

  componentDidMount() {
    console.log('componentDidMount');
    this.fetchNumOfPhotos();
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
    if (prevProps.targetId !== this.props.targetId) {
      this.setState(this.getInitialState());
    } else if (this.state.serverCallInProgress) {
        switch (this.state.serverCallInProgress) {
          case LOGGING_IN:
            break; // nothing to do here
          case GETTING_NUM_OF_PHOTOS:
            this.fetchNumOfPhotos();
            break;
          case GETTING_PHOTO:
            this.fetchPhoto();
            break;
          case DELETING_PHOTO:
            this.deletePhoto();
            break;
          default:
            assert.fail(`unrecognized server call type: ${this.state.serverCallType}`);
        }
      }
  }

  render() {
    if (this.state.serverCallInProgress) {
      switch (this.state.serverCallInProgress) {
        case LOGGING_IN:
          return (
            <>
            <img src={loading} className='img-fluid' alt='User re-signing in &hellip;'/>
            <div>User re-signing in &hellip;</div>
            </>
          );
        case GETTING_NUM_OF_PHOTOS:
          return (
            <>
            <img src={loading} className='img-fluid' alt='Retrieving # of photos &hellip;'/>
            <div>Retrieving number of photos &hellip;</div>
            </>
          );
        case GETTING_PHOTO:
          return (
            <>
            <img src={loading} className='img-fluid' alt='Retrieving photo &hellip;'/>
            <div>Retrieving photo &hellip;</div>
            </>
          );
        case DELETING_PHOTO:
          return (
            <>
            <img src={loading} className='img-fluid' alt='Deleting photo &hellip;'/>
            <div>Deleting photo &hellip;</div>
            </>
          );
        default:
          assert.fail(`unrecognized server call type: ${this.state.serverCallType}`);
      } // switch
    } else {
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
        const prevNextStyle = {fontSize: 18, fontWeight: 'bold'};
        const photoDateAndDeletion = this.getPhotoDateAndDeletion(this.props.targetId, currentPhotoIndx, photoBase64Instant);
        return (
          <>
          <div className='d-flex flex-row justify-content-between'>
            <button type="button" disabled={firstImage} className={cx(prevButtonClasses)} style={prevNextStyle} onClick={this.prevImage}>&lt;</button>
            Φωτό {currentPhotoIndx+1} από {numOfPhotos}
            <button type="button" disabled={lastImage} className={cx(nextButtonClasses)} style={prevNextStyle} onClick={this.nextImage}>&gt;</button>
          </div>
          {photoDateAndDeletion}
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
        if (numOfPhotos>0)
          this.setState({serverCallInProgress: GETTING_PHOTO
                       , numOfPhotos: numOfPhotos
                       , currentPhotoIndx: 0});
        else
          this.setState({serverCallInProgress: null});
      } else {
        this.setState({serverCallInProgress: null
                     , error: {message: `server-side error: ${err.message}`
                             , details: err.strServerTrace}});
      }
    }).catch( err => {
      console.log(JSON.stringify(err));
      console.log(err);
      if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case 'JWT-verif-failed':
            this.props.displayModalLogin( ()=>{this.fetchNumOfPhotos();} );
            this.setState({serverCallInProgress: LOGGING_IN
                         , error: {message: `JWT verif. failed. Server message is: [${msg}]`
                                 , details: details}});
            break;
          default:
            this.setState({serverCallInProgress: null
                         , error: {message: `unexpected error code: ${code}`
                                 , details: msg}});
        }
      } else {
        this.setState({serverCallInProgress: null
                     , error: {message: 'unexpected error - likely a bug'
                             , details: JSON.stringify(err)}});
      }
    }) // catch
  } // fetchNumOfPhotos

fetchPhoto = () => {
  const url = urlForPhoto(this.props.targetId, this.state.currentPhotoIndx);
  console.log(`fetchPhoto axios url is [${url}]`);
  axiosAuth.get(url).then(res => {
    console.log(res);
    const {t: {imageBase64, instant}, err} = res.data; // corr-id: SSE-1585746250
    if (err===null) {
      this.setState({serverCallInProgress: null
                   , photoBase64: imageBase64
                   , photoBase64Instant: instant
                   , error: null});
    } else {
      this.setState({ serverCallInProgress: null
                    , photoBase64: null
                    , error: {message: err.message
                            , details: err.strServerTrace}});
    }
  }).catch( err => {
    console.log(JSON.stringify(err));
    console.log(err);
    if (err.response && err.response.data) {
      // corr-id: SSE-1585746388
      const {code, msg, details} = err.response.data;
      switch(code) {
        case 'JWT-verif-failed':
          this.props.displayModalLogin( ()=>{this.fetchPhoto();});
          this.setState({serverCallInProgress: LOGGING_IN
                       , error: {message: `JWT verif. failed. Server message is: [${msg}]`
                               , details: details}});
          break;
        default:
          this.setState({serverCallInProgress: null
                       , error: {message: `unexpected error code: ${code}`
                               , details: msg}});
      }
    } else {
      this.setState({serverCallInProgress: null
                   , error: {message: 'unexpected error - likely a bug'
                           , details: JSON.stringify(err)}});
    }
  });
}
  deletePhoto = () => {
    console.log(`delete photo #${this.props.currentPhotoIndx} for tree ${this.props.targetId}`);
    axiosAuth.delete(url
    ).then(res => {
      const {t, err} = res.data; 
      if (err===null) {
        const numOfPhotos = t;
        const currentPhotoIndx = numOfPhotos>0?0:null;
        this.setState({userIsLoggingIn: false
                     , loadingNumOfPhotos: false
                     , loadingPhoto: numOfPhotos>0
                     , numOfPhotos: numOfPhotos
                     , currentPhotoIndx: currentPhotoIndx
                     , photoBase64: null
                     , error: null});
      } else {
        this.setState({ userIsLoggingIn: false
                      , loadingNumOfPhotos: false
                      , numOfPhotos: null
                      , error: {message: `server-side error while deleting photo #{photoIndx} on tree #{this.props.targetId}: ${err.message}`
                              , details: err.strServerTrace}});
      }
    }).catch( err => {
      console.log(JSON.stringify(err));
      console.log(err);
      if (err.response && err.response.data) {
        // SSE-1585746388: the shape of err.response.data is (code, msg, details)
        // Java class ValidJWSAccessTokenFilter#AbortResponse
        const {code, msg, details} = err.response.data;
        switch(code) {
          case 'JWT-verif-failed':
            this.props.displayModalLogin( ()=>{this.fetchNumOfPhotos();} );
            this.setState({userIsLoggingIn: true
                         , loadingNumOfPhotos: false
                         , error: {message: `JWT verif. failed. Server message is: [${msg}]`
                                 , details: details}});
            break;
          default:
            this.setState({loadingNumOfPhotos: false
                         , error: {message: `unexpected error code: ${code}`
                                 , details: msg}});
        }
      } else {
        this.setState({loadingNumOfPhotos: false
                     , error: {message: 'unexpected error - likely a bug'
                             , details: JSON.stringify(err)}});
      }
    }) // catch
  } // fetchNumOfPhotos    

  
  getPhotoDateAndDeletion = (targetId, photoIndx, photoBase64Instant) => {
    const localDate = new Date();
    localDate.setUTCSeconds(photoBase64Instant);
    const localDateString = localDate.toLocaleDateString('el-GR');
    const divDate = (<div>Λήψη {localDateString}</div>);

    return (
      <div style={{display: 'flex'
                 , flexDirection: 'row'
                 , justifyContent: 'space-around'
                 , marginTop: '.5em'
                 , marginBottom: '.5em'}}>
        <span>λήψη {localDateString}</span>
        <Button variant='outline-danger' onClick={()=>this.deletePhoto(photoIndx)}>Διαγραφή</Button>
      </div>
    );
  }
} // class


function urlForPhoto(targetId, indx) {
  const url = `/feature/${targetId}/photos/elem/${indx}`;
  return url;
}


function urlForNumOfPhotos(targetId) {
  const url=`/feature/${targetId}/photos/num`;
  return url;
}


export default connect(mapStateToProps, mapDispatchToProps)(TargetPhotoPane);
