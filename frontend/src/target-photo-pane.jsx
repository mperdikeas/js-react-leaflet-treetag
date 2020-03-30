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

import {BASE_URL} from './constants.js';

import {axiosAuth} from './axios-setup.js';


// REDUX
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    targetId: state.targetId
  };
};



class TargetPhotoPane extends React.Component {

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
    if (prevProps.targetId !== this.props.targetId) {
      this.setState(this.getInitialState());
      this.fetchNumOfPhotos();
    } else if ((prevState.currentPhotoIndx !== this.state.currentPhotoIndx)
               && (this.state.currentPhotoIndx!=null))
      this.fetchPhoto();
  }

  render() {
    if (false)
    console.log(`render(), state is: ${JSON.stringify(this.state)}`);
    if ((this.state.numOfPhotos === null) || ((this.state.numOfPhotos>0) && (this.state.photoBase64===null))) {
      return (
        <img src={loading} className='img-fluid' alt='Please wait...'/>
      );

    } else {

      const {numOfPhotos, currentPhotoIndx, photoBase64, photoBase64Instant} = this.state;
      if (this.state.error===null) {
        if (false)
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
    const url = urlForNumOfPhotos(this.props.targetId);
    console.log(`axios URL is: ${url}`);
    axiosAuth.get(url
//            , {headers: createAxiosAuthHeader()}
         ).then(res => {
           const {t, err} = res.data; // this is a ValueOrInternalServerExceptionData data type on the server side
           if (err===null) {
             const numOfPhotos = t;
             const currentPhotoIndx = numOfPhotos>0?0:null;
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
    const url = urlForPhoto(this.props.targetId, this.state.currentPhotoIndx);
    axiosAuth.get(url
//            , {headers: createAxiosAuthHeader()}
      ).then(res => {
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

function uuidToNumber(uuid) {
  return uuid.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}


function urlForPhoto(targetId, indx) {
  const effectiveTargetId = Math.abs(uuidToNumber(targetId));
  const url = `${BASE_URL}/feature/${effectiveTargetId}/photos/elem/${indx}`;
  return url;
  }


function urlForNumOfPhotos(targetId) {
  const effectiveTargetId = Math.abs(uuidToNumber(targetId));
  const url=`${BASE_URL}/feature/${effectiveTargetId}/photos/num`;
  return url;
  }


export default connect(mapStateToProps)(TargetPhotoPane);
