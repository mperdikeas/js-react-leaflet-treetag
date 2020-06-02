const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';


import {markGetFeatureInfoInProgress
      , displayModal
      , clearModal
      , setTreeInfoOriginal
      , markGetFeatureInfoFailed} from './index.js';
import {MODAL_LOGIN
      , MDL_NOTIFICATION
      , MDL_NOTIFICATION_NO_DISMISS} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {isInsufficientPrivilleges} from '../../util-privilleges.js';

import {GSN, globalGet} from '../../globalStore.js';

const targetId2Marker = (targetId) => {
  return globalGet(GSN.REACT_MAP).id2marker[targetId];
}


const displayTreeDataHasBeenUpdated = (dispatch, id)=>{
  const  msgTreeDataHasBeenUpdated = id => `τα νέα δεδομένα για το δένδρο #${id} αποθηκεύτηκαν`;
  dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataHasBeenUpdated(id)}));
}

const displayModalLogin = (dispatch, func)  => dispatch(displayModal(MODAL_LOGIN, {followUpFunction: func}));

const displayNotificationInsufPrivilleges = (dispatch)=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgInsufPriv1}));

const displayModalSavingTreeData = (dispatch, id)=>{
  const msgSavingTreeData = id => `αποθήκευση δεδομένων για το δένδρο #${id}`;
  dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msgSavingTreeData(id)}))
};

export default function saveFeatureData(treeInfo) {
  assert.isOk(treeInfo);
  const {id} = treeInfo;
  assert.isOk(id);
  return (dispatch) => {
    const url = `/feature/${id}/data`;
    console.log(`saveFeatureData, axios URL is: ${url}`);
    displayModalSavingTreeData(dispatch, id);

    axiosAuth.post(url, treeInfo).then(res => {
      dispatch(clearModal());
      console.log('in axios;:then');
      //      this.props.clearModal();
      //    this.setState({serverCallInProgress: null});
      if (res.data.err != null) {
        console.error(`${url} data POST error`);
        console.error(res.data.err);
        dispatch( markSaveFeatureInfoFailed() );
        dispatch( displayModal(MDL_NOTIFICATION_NO_DISMISS,
                               {html: (<div>
  Failed to save data on tree case 1: {JSON.stringify(res.data.err)}
                               </div>
                               )}));        
      } else {
        console.log(`${url} data POST success`);
        const markerInMainMap = targetId2Marker(id);
        const {latitude: lat, longitude: lng} = treeInfo.coords;
        const latlng = L.latLng(lat, lng);
        markerInMainMap.setLatLng(latlng);
        globalGet(GSN.REACT_MAP).adjustHighlightingMarker(latlng);


        const targAdjPane = globalGet(GSN.TARG_ADJ_PANE, false);
        if (targAdjPane) {
          targAdjPane.adjustMovableMarker(latlng);
        }
        displayTreeDataHasBeenUpdated(dispatch, id);
        dispatch(setTreeInfoOriginal(treeInfo))
      }
    }).catch( err => {
      console.error('in axios::catch');
      dispatch(clearModal());
      //      this.setState({serverCallInProgress: null});
      if (isInsufficientPrivilleges(err)) {
        console.log('insuf detected');
        displayNotificationInsufPrivilleges(dispatch);
      } else {
        if (err.response && err.response.data) {
          // SSE-1585746388: the shape of err.response.data is (code, msg, details)
          // Java class ValidJWSAccessTokenFilter#AbortResponse
          const {code, msg, details} = err.response.data;
          switch(code) {
            case 'JWT-verif-failed':
              dispatch(displayModalLogin(dispatch, ()=>{dispatch(saveFeatureData(treeInfo))}));
              break;
            default: {
              console.error(err);
              dispatch( displayModal(MDL_NOTIFICATION_NO_DISMISS,
                                     {html: (<div>
                                 Failed to save data on tree case 2: {JSON.stringify(res.data.err)}
                                     </div>
                                     )}));
            }
          }
        } else {
          console.error(err);
          dispatch( displayModal(MDL_NOTIFICATION_NO_DISMISS,
                                 {html: (<div>
                                       Failed to save data on tree case 3: {JSON.stringify(err)}
                                 </div>
                                 )}));
        }
      }
    });
  }
}

