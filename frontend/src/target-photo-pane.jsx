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

import { v4 as uuidv4 } from 'uuid';

// REDUX
import { connect } from 'react-redux';


import TargetPhotoPaneImgWithControls from './target-photo-pane-img-wt-controls.jsx';
  
const mapStateToProps = (state) => {
  return {
    targetId: state.target.id
    , photos: state.target.photos
    , fetchingNewPhotoForExistingTarget: fetchingNewPhotoForExistingTarget(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
}



class TargetPhotoPane extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    assert.isTrue(isNotNullOrUndefined(this.props.photos), 'target-photo-pane.jsx::render 0');
    const {num, idx, img, t} = this.props.photos;
    assert.isNotNull(num, 'target-photo-pane.jsx::render 1');
    if (this.props.photos.num===undefined) {
      return (
        <>
        <img src={loading} className='img-fluid'/>
        <div>Retrieving number of photos for {this.props.targetId} &hellip;</div>
        </>
      );
    } else if (this.props.photos.num===0) {
      return (
        <>
        <div>no photos are available</div>
        </>
      );
    } else if (this.props.fetchingNewPhotoForExistingTarget) {
      assert.isTrue(isNotNullOrUndefined(num), 'target-photo-pane.jsx::render 2');
      assert.isTrue(isNotNullOrUndefined(idx), 'target-photo-pane.jsx::render 3');
      return (
        <>
        <img src={loading} className='img-fluid'/>
        <div>Retrieving photo {idx+1} (of {num}) for {this.props.targetId} &hellip;</div>
        </>
      )
    } else {
      assert.isTrue(isNotNullOrUndefined(num), 'target-photo-pane.jsx::render 4');
      assert.isTrue(isNotNullOrUndefined(idx) , 'target-photo-pane.jsx::render 5');
      assert.isDefined(img, 'target-photo-pane.jsx::render 6');
      assert.isDefined(t, 'target-photo-pane.jsx::render 7');
      return <TargetPhotoPaneImgWithControls/>;
    }
  }

  
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


function urlForPhotoDeletion(targetId, indx) {
  return urlForPhoto(targetId, indx);
}

function urlForPhoto(targetId, indx) {
  const url = `/feature/${targetId}/photos/elem/${indx}`;
  return url;
}


function urlForNumOfPhotos(targetId) {
  const url=`/feature/${targetId}/photos/num`;
  return url;
}


export default connect(mapStateToProps, mapDispatchToProps)(TargetPhotoPane);
