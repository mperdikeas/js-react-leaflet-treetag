import {Dispatch} from 'react';
import {axiosAuth} from '../../axios-setup.js';
import { v4 as uuidv4 } from 'uuid';

import {ActionDisplayModalNotification, ActionAddToast} from './action-types.ts';

import {displayModal
      , displayModalNotificationNonDismissable
      , clearModal
      , getRegions
      , addToast
      , setWktRegionUnderConstruction} from './index.ts';
import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';


import {GSN, globalGet} from '../../globalStore.js';
import {propsForRetryDialog} from './action-util.tsx';
import {BackendResponse} from '../../backend.d.ts';
import {handleAxiosException} from './action-axios-exc-util.ts';


function displayModalCreatingNewRegion (dispatch: Dispatch<ActionDisplayModalNotification>, region: string, partition: string, uuid: string) {
  const html = `saving region ${region} under partition ${partition} ...`;
  dispatch(displayModalNotificationNonDismissable(html, uuid));
}

function notifyRegionHasBeenCreated (dispatch: Dispatch<ActionAddToast>, region: string, partition: string) {
  const msg = `region '${region}' has been successfully created under ${partition}`;
  dispatch(addToast('region created', msg));
}

export default function createRegion(region: string, wkt: string, partition: string, idOfDialogsToClear: string[]) {
  const actionCreator = `createRegion(${region}, ${partition}, [${idOfDialogsToClear.join(', ')}]`;

  return (dispatch: Dispatch<any>) => {
    const f = ()=>dispatch(createRegion(region, wkt, partition, idOfDialogsToClear));

    const url = `/partitions/elem/${partition}/regions/elem/${region}`;
    console.debug(`${actionCreator} - axios URL is: ${url}`);
    const uuid = uuidv4();
    displayModalCreatingNewRegion(dispatch, region, partition, uuid);

    axiosAuth.put(url, wkt)
             .then( (res: BackendResponse<any>) => {
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
             }).catch( (err: any) => {
               dispatch(clearModal(uuid));
               handleAxiosException(err, dispatch, f, url, actionCreator);
             });
  }
}

