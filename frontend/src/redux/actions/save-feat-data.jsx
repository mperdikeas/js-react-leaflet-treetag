const React = require('react');
const assert = require('chai').assert;
import {getAccessToken} from '../../access-token-util.js';
import {axiosAuth} from '../../axios-setup.js';
import {CancelToken} from 'axios';
import { v4 as uuidv4 } from 'uuid';

import {markGetFeatureInfoInProgress
      , displayModal
      , clearModal
      , setTreeInfoOriginal
      , markGetFeatureInfoFailed} from './index.js';
import {MDL_NOTIFICATION
      , MDL_NOTIFICATION_NO_DISMISS
      , MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {isInsufficientPrivilleges} from '../../util-privilleges.js';

import {GSN, globalGet} from '../../globalStore.js';

import {isNotNullOrUndefined} from '../../util/util.js';
import {propsForRetryDialog} from './action-util.jsx';



import {handleAxiosException} from './action-axios-exc-util.js';

const targetId2Marker = (targetId) => {
  return globalGet(GSN.REACT_MAP).id2marker[targetId];
}

const displayTreeDataHasBeenUpdated = (dispatch, id)=>{
  const  msgTreeDataHasBeenUpdated = id => `τα νέα δεδομένα για το δένδρο #${id} αποθηκεύτηκαν`;
  dispatch(displayModal(MDL_NOTIFICATION, {html: msgTreeDataHasBeenUpdated(id), uuid:uuidv4()}));
}

const displayModalSavingTreeData = (dispatch, id, uuid)=>{
  const msgSavingTreeData = id => `αποθήκευση δεδομένων για το δένδρο #${id}`;
  dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html: msgSavingTreeData(id), uuid}))
};

export default function saveFeatData(treeInfo) {
  const actionCreator = `saveFeatData(${treeInfo.id}, ...)`;
  console.log(actionCreator);

  assert.isOk(treeInfo);
  const {id} = treeInfo;
  assert.isTrue(isNotNullOrUndefined(id));
  return (dispatch) => {
    const f = ()=>dispatch(saveFeatData(treeInfo));

    const url = `/feature/${id}/data`;
    console.log(`saveFeatData, axios URL is: ${url}`);
    const uuid = uuidv4();
    displayModalSavingTreeData(dispatch, id, uuid);

    axiosAuth.post(url, treeInfo)
             .then(res => {
               dispatch(clearModal(uuid));
               const {t, err} = res.data;
               if (err != null) {
                 console.error(`${actionCreator} :: error at URL [${url}]`);
                 console.error(res.data.err);
                 dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
               } else {
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
               dispatch(clearModal(uuid));
               handleAxiosException(err, dispatch, f, url, actionCreator);
             });
  }
}

