import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {axiosAuth} from '../../axios-setup.js';

import { v4 as uuidv4 } from 'uuid';

import {ActionDisplayModalNotification} from './action-types.ts';

import {displayModal
      , displayModalNotification
      , clearModal
      , setTreeInfoOriginal} from './index.ts';
import {MDL_RETRY_CANCEL} from '../../constants/modal-types.js';



import {GSN, globalGet} from '../../globalStore.js';

import {isNotNullOrUndefined} from '../../util/util.js';
import {propsForRetryDialog} from './action-util.tsx';



import {handleAxiosException} from './action-axios-exc-util.ts';

import {ActionSaveFeatData} from './action-types.ts';

import {TreeInfoWithId, BackendResponse} from '../../backend.d.ts';

const targetId2Marker = (targetId: number) => {
  return globalGet(GSN.REACT_MAP).id2marker[targetId];
}

const displayTreeDataHasBeenUpdated = (dispatch: React.Dispatch<ActionDisplayModalNotification>, id: number)=>{
  const html = `τα νέα δεδομένα για το δένδρο #${id} αποθηκεύτηκαν`;
  dispatch(displayModalNotification(html));
}

const displayModalSavingTreeData = (dispatch: React.Dispatch<ActionDisplayModalNotification>, id: number, uuid: string)=>{
  const html = `αποθήκευση δεδομένων για το δένδρο #${id}`;
  dispatch(displayModalNotification(html));
};

export default function saveFeatData(treeInfo: TreeInfoWithId): ActionSaveFeatData {
  const actionCreator = `saveFeatData(${treeInfo.id}, ...)`;
  console.log(actionCreator);

  assert.isOk(treeInfo);
  const {id} = treeInfo;
  assert.isTrue(isNotNullOrUndefined(id));
  return (dispatch: React.Dispatch<any>) => {
    const f = ()=>dispatch(saveFeatData(treeInfo));

    const url = `/feature/${id}/data`;
    console.log(`saveFeatData, axios URL is: ${url}`);
    const uuid = uuidv4();
    displayModalSavingTreeData(dispatch, id, uuid);

    axiosAuth.post(url, treeInfo)
             .then( (res: BackendResponse<never>) => {
               dispatch(clearModal(uuid));
               const {err} = res.data;
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
             }).catch( (err: any) => {
               dispatch(clearModal(uuid));
               handleAxiosException(err, dispatch, f, url, actionCreator);
             });
  }
}

