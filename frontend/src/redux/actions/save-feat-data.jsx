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
      , MDL_NOTIFICATION_NO_DISMISS
      , MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

import {isInsufficientPrivilleges} from '../../util-privilleges.js';

import {GSN, globalGet} from '../../globalStore.js';

import {isNotNullOrUndefined} from '../../util/util.js';
import {propsForRetryDialog} from './action-util.jsx';

import { v4 as uuidv4 } from 'uuid';

const targetId2Marker = (targetId) => {
  return globalGet(GSN.REACT_MAP).id2marker[targetId];
}

const displayTreeDataHasBeenUpdated = (dispatch, id)=>{
  const  msgTreeDataHasBeenUpdated = id => `τα νέα δεδομένα για το δένδρο #${id} αποθηκεύτηκαν`;
  dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataHasBeenUpdated(id), uuid:uuidv4()}));
}

const displayModalLogin = (dispatch, uuid, func)  => dispatch(displayModal(MODAL_LOGIN, {uuid, followupFunc: ()=>dispatch(func())}));

const displayNotificationInsufPrivilleges = (dispatch, uuid)=>dispatch(displayModal(MDL_NOTIFICATION, {html: msgInsufPriv1, uuid}));

const displayModalSavingTreeData = (dispatch, id, uuid)=>{
  const msgSavingTreeData = id => `αποθήκευση δεδομένων για το δένδρο #${id}`;
  dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msgSavingTreeData(id), uuid}))
};

export default function saveFeatData(treeInfo) {
  const actionCreator = `saveFeatData(${treeInfo.id}, ...)`;
  console.log(actionCreator);
  const f = ()=>saveFeatData(treeInfo);
  assert.isOk(treeInfo);
  const {id} = treeInfo;
  assert.isTrue(isNotNullOrUndefined(id));
  return (dispatch) => {
    const url = `/feature/${id}/data`;
    console.log(`saveFeatData, axios URL is: ${url}`);
    const uuid = uuidv4();
    displayModalSavingTreeData(dispatch, id, uuid);

    axiosAuth.post(url, treeInfo).then(res => {
      dispatch(clearModal(uuid));
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
                               </div>)
                                 , uuid: 'this can never be dismissed'
                               }));
        throw 'todo - how should I handle this post error?';
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
      console.error('error in [save-feat-data.jsx] ~*~ axios::catch');
      console.error(err);
      dispatch(clearModal(uuid));

      //      this.setState({serverCallInProgress: null});
      if (isInsufficientPrivilleges(err)) {
        console.log('insuf detected');
        displayNotificationInsufPrivilleges(dispatch, uuidv4());
      } else {
        if (err.response && err.response.data) {
          // SSE-1585746388: the shape of err.response.data is (code, msg, details)
          // Java class ValidJWSAccessTokenFilter#AbortResponse
          const {code, msg, details} = err.response.data;
          switch(code) {
            case 'JWT-verif-failed':
              displayModalLogin(dispatch, uuidv4(), f);
              break;
            default: {
              console.error(err);
              console.error(err.response);
              console.error(err.response.data);

              dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error case 2', err)) );
              break;
            }
          }
        } else {
          console.error(err);
          console.error(err.response);
          console.error(err.response.data);
          dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error case 3', err)) );
        }
      }
    });
  }
}

