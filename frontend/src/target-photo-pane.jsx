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
      userIsLoggingIn: false
      , loadingNumOfPhotos: true
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
    if (this.state.userIsLoggingIn) {
      return (
        <>
        <img src={loading} className='img-fluid' alt='User re-signing in &hellip;'/>
        <div>User re-signing in &hellip;</div>
        </>
      );
    } else if (this.state.loadingNumOfPhotos) {
      return (
        <>
        <img src={loading} className='img-fluid' alt='Retrieving # of photos &hellip;'/>
        <div>Retrieving number of photos &hellip;</div>
        </>
      );

    } else if (this.state.loadingPhoto) {
      return (
        <>
        <img src={loading} className='img-fluid' alt='Retrieving photo &hellip;'/>
        <div>Retrieving photo &hellip;</div>
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
        const localDate = new Date();
        localDate.setUTCSeconds(photoBase64Instant);
        const localDateString = localDate.toLocaleDateString('el-GR');
        const divActualDate = (<div>photo of {this.props.targetId} taken on {localDateString}</div>);
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

fetchPhoto = () => {
  const url = urlForPhoto(this.props.targetId, this.state.currentPhotoIndx);
  console.log(`fetchPhoto axios url is [${url}]`);
  axiosAuth.get(url).then(res => {
    console.log(res);
    const {t: {photoBase64, instant}, err} = res.data; // corr-id: SSE-1585746250
      if (err===null) {
      this.setState({userIsLoggingIn: false
                   , loadingPhoto: false
                   , photoBase64: photoBase64
                   , photoBase64Instant: instant
                   , error: null});
    } else {
      this.setState({ userIsLoggingIn: false
                    , loadingPhoto: false
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
          this.setState({userIsLoggingIn: true
                       , loadingPhoto: false
                       , error: {message: `JWT verif. failed. Server message is: [${msg}]`
                               , details: details}});
          break;
        default:
          this.setState({loadingPhoto: false
                       , error: {message: `unexpected error code: ${code}`
                               , details: msg}});
      }
    } else {
      this.setState({loadingPhoto: false
                   , error: {message: 'unexpected error - likely a bug'
                           , details: JSON.stringify(err)}});
    }
  });
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
