const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {Button} from 'react-bootstrap';
import {axiosAuth} from './axios-setup.js';


import {CancelToken} from 'axios';

const loading  = require('./resources/loading.gif');
// require('../resources/down-arrow.png');
import DownArrow from './resources/down-arrow.png';
// const download = url('../resources/
import {sca_fake_return, isNotNullOrUndefined} from './util/util.js';


import {fetchingNewPhotoForExistingTarget} from './redux/selectors.js';


// REDUX
import { connect } from 'react-redux';

import {delFeatPhoto
      , getFeatPhoto} from './redux/actions/index.js';

import {LOGGING_IN
      , GETTING_NUM_OF_PHOTOS
      , GETTING_PHOTO
      , DELETING_PHOTO} from './constants/target-photo-pane-server-call-types.js';


import {OP_NO_LONGER_RELEVANT} from './util/axios-util.js';
  
const mapStateToProps = (state) => {
  const {num, idx, img: photoBase64, t} = state.target.photos;
  assert.isTrue(isNotNullOrUndefined(num), 'target-photo-pane-img-wt-controls.jsx::render 1');
  assert.isDefined(idx                   , 'target-photo-pane-img-wt-controls.jsx::render 2');
  assert.isDefined(photoBase64           , 'target-photo-pane-img-wt-controls.jsx::render 3');
  assert.isDefined(t                     , 'target-photo-pane-img-wt-controls.jsx::render 4');
  return {
    targetId: state.target.id
    , photos: state.target.photos
    , fetchingNewPhotoForExistingTarget: fetchingNewPhotoForExistingTarget(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    prevImage: (id, idx) => {
      assert.isTrue(idx>0
                  , `target-photo-pane-img-wt-controls.jsx :: mapDispatchToProps, prevImage ~ idx value of [${idx}] is not GT 0`);
      dispatch(getFeatPhoto(id, idx-1));
    }
    , nextImage: (id, idx) => {dispatch(getFeatPhoto(id, idx+1));}
    , delFeatPhoto: (id, idx) => {dispatch(delFeatPhoto(id, idx));}
  };
}




class TargetPhotoPaneImgWithControls extends React.Component {

  constructor(props) {
    super(props);

    this.source = CancelToken.source();
  }

  prevImage = () => {
    this.props.prevImage(this.props.targetId, this.props.photos.idx);
    /*
    this.setState({serverCallInProgress: GETTING_PHOTO
                 , currentPhotoIndx: this.state.currentPhotoIndx-1
                 , photoBase64: null});
    */
  }
  
  nextImage = () => {
    assert.isTrue(this.props.photos.idx < this.props.photos.num-1
                , `target-photo-pane-img-wt-controls.jsx :: nextImage idx=${this.props.photos.idx}, num=${this.props.photos.num}`);
    this.props.nextImage(this.props.targetId, this.props.photos.idx);
    /*
    this.setState({serverCallInProgress: GETTING_PHOTO
                 , currentPhotoIndx: this.state.currentPhotoIndx+1
                 , photoBase64: null});
    */
  }    

// TODO: I should cancel the save axios requests as well
  

  componentDidUpdateDELME(prevProps, prevState) {
    if (prevProps.targetId !== this.props.targetId) {
      console.log('cancelling pending requests due to new target');
      this.source.cancel(OP_NO_LONGER_RELEVANT);
      /*      
       * SSE-1589117399
       * The below is mighty important - we need a new cancel token otherwise the above
       * cancel somehow interferes with requests made for the new tree. I still don't
       * get why this is the case but it works better with the next line in file.
       */
      this.source = CancelToken.source();
      this.setState(this.getInitialState());
    }
  }
  
  render() {
    const {num, idx, img: photoBase64, t} = this.props.photos;
        if (num===0) {
          assert.isNull(photoBase64);
          return (
            <>
            <div>no photos are available</div>
            </>
          );
        }


    const imageDiv = (()=>{
      if (this.props.fetchingNewPhotoForExistingTarget) {
        throw '42 - this is dead code / remove it!';
        return <div>fetching new shit</div>
      } else {
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
        const firstImage = idx===0;
        const lastImage = idx===num-1;
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
        const photoDateAndDeletion = this.getPhotoDateAndDeletion(this.props.targetId, idx, t);
        return (
          <>
          <div className='d-flex flex-row justify-content-between'>
            <button type="button" disabled={firstImage} className={cx(prevButtonClasses)} style={prevNextStyle} onClick={this.prevImage}>&lt;</button>
            Φωτό {idx+1} από {num}
            <button type="button" disabled={lastImage} className={cx(nextButtonClasses)} style={prevNextStyle} onClick={this.nextImage}>&gt;</button>
          </div>
          {photoDateAndDeletion}
          {imageDiv}
          </>
        );
    }



  getPhotoDateAndDeletion = (targetId, idx, t) => {
    const localDate = new Date();
    localDate.setUTCSeconds(t);
    const localDateString = localDate.toLocaleDateString('el-GR');
    const divDate = (<div>Λήψη {localDateString}</div>);

    return (
      <div style={{display: 'flex'
                 , flexDirection: 'row'
                 , justifyContent: 'space-around'
                 , marginTop: '.5em'
                 , marginBottom: '.5em'}}>
        <span>λήψη {localDateString}</span>
        <Button variant='outline-danger' onClick={()=>this.props.delFeatPhoto(targetId, idx)}>Διαγραφή</Button>
      </div>
    );
  }
} // class
  


export default connect(mapStateToProps, mapDispatchToProps)(TargetPhotoPaneImgWithControls);
