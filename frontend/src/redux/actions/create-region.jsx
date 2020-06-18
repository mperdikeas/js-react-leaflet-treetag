const React = require('react');
const assert = require('chai').assert;
import {axiosAuth} from '../../axios-setup.js';
import { v4 as uuidv4 } from 'uuid';

import {displayModal
      , clearModal
      , getRegions
      , addToast
      , setWktRegionUnderConstruction} from './index.js';
import {MDL_NOTIFICATION
      , MDL_NOTIFICATION_NO_DISMISS
      , MDL_RETRY_CANCEL} from '../../constants/modal-types.js';

import {isInsufficientPrivilleges} from '../../util-privilleges.js';

import {GSN, globalGet} from '../../globalStore.js';

import {isNotNullOrUndefined} from '../../util/util.js';
import {propsForRetryDialog} from './action-util.jsx';



import {handleAxiosException} from './action-axios-exc-util.js';


function displayModalCreatingNewRegion (dispatch, region, partition, uuid) {
  const html = `saving region ${region} under partition ${partition} ...`;
  dispatch(displayModal(MDL_NOTIFICATION_NO_DISMISS, {html, uuid}));
}

function notifyRegionHasBeenCreated (dispatch, region, partition) {
  const msg = `region '${region}' has been successfully created under ${partition}`;
  dispatch(addToast('region created', msg));
}

export default function createRegion(region, wkt, partition, idOfDialogsToClear) {
  const actionCreator = `createRegion(${region}, ${partition}, [${idOfDialogsToClear.join(', ')}]`;
  console.log(actionCreator);

  return (dispatch) => {
    const f = ()=>dispatch(createRegion(region, wkt, partition, idOfDialogsToClear));

    const url = `/partitions/elem/${partition}/regions/elem/${region}`;
    console.log(`${actionCreator} - axios URL is: ${url}`);
    const uuid = uuidv4();
    displayModalCreatingNewRegion(dispatch, region, partition, uuid);

    axiosAuth.put(url, wkt)
             .then(res => {
               dispatch(clearModal(uuid));
               const {t, err} = res.data;
               console.log(t); // todo: examine for possible race conditions
               if (err != null) {
                 console.error(`${actionCreator} :: error at URL [${url}]`);
                 console.error(res.data.err);
                 dispatch( displayModal(MDL_RETRY_CANCEL, propsForRetryDialog(dispatch, f, url, actionCreator, 'server-side error', err)) );
               } else {
                 idOfDialogsToClear.forEach( (uuid)=>{dispatch(clearModal(uuid))} );
                 notifyRegionHasBeenCreated(dispatch, region, partition);
                 dispatch(getRegions(true));
                 globalGet(GSN.REACT_RGM_MAP).clearDrawnRegions();
                 dispatch(setWktRegionUnderConstruction(null));
               }
             }).catch( err => {
               dispatch(clearModal(uuid));
               handleAxiosException(err, dispatch, f, url, actionCreator);
             });
  }
}

