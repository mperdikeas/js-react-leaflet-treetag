const React = require('react');
const assert = require('chai').assert;
import {axiosAuth} from '../../axios-setup.js';
import { v4 as uuidv4 } from 'uuid';

import {displayModal
      , clearModal
      , getRegions
      , addToast} from './index.js';
import {MDL_NOTIFICATION
      , MDL_NOTIFICATION_NO_DISMISS
      , MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {isInsufficientPrivilleges} from '../../util-privilleges.js';

import {GSN, globalGet} from '../../globalStore.js';

import {isNotNullOrUndefined} from '../../util/util.js';
import {propsForRetryDialog} from './action-util.jsx';



import {handleAxiosException} from './action-axios-exc-util.js';


function displayModalCreatingNewRegion (dispatch, region, partition, uuid)=>{
  const html = `saving region ${region} under partition ${partition}`;
  dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html, uuid}));
};

function notifyRegionHasBeenCreated (dispatch, region, partition)=>{
  const msg = `region '${region}' has been successfully created under ${partition}`;
  dispatch(addToast('region created', msg));
}

export default function createRegion(region, wkt, partition, idOfDialogsToClear) {
  const actionCreator = `createRegion(${region}, ${partition}, [${idOfDialogsToClear.join(', ')}]`;
  console.log(actionCreator);

  return (dispatch) => {
    const f = ()=>dispatch(createRegion(region, wkt, partition, idOfDialogsToClear));

    const url = `/this-is-dog-shit`;
    console.log(`${actionCreator} - axios URL is: ${url}`);
    const uuid = uuidv4();
    displayModalCreatingNewRegion(dispatch, region, partition, uuid);

    axiosAuth.post(url, wkt)
             .then(res => {
               dispatch(clearModal(uuid));
               const {t, err} = res.data;
               if (err != null) {
                 console.error(`${actionCreator} :: error at URL [${url}]`);
                 console.error(res.data.err);
                 dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
               } else {
                 notifyRegionHasBeenCreated(dispatch, region, partition);
                 dispatch(getRegions());
               }
             }).catch( err => {
               dispatch(clearModal(uuid));
               handleAxiosException(err, dispatch, f, url, actionCreator);
             });
  }
}

