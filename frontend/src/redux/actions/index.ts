//import chai from '../../util/chai-util.js';
//chai.Assertion.includeStack = true; // https://stackoverflow.com/a/13396945/274677

import chai from '../../util/chai-util.js';
const assert = chai.assert;
import { v4 as uuidv4 } from 'uuid';

import {StandardAction
        , ActionUpdateMouseCoords
        , ActionToggleMaximizeInfoPanel
        , ActionUnsetTarget
        , ActionGetFeatureAjaxConcluded
        , ActionRevertTreeCoords
        , ActionGetRegionsInProgress
        , ActionRevertTreeInfo
        , ActionNoPayload
        , ActionSetTreeInfoCurrent
        , ActionSetTreeInfoOriginal} from './types.ts';



import { UPDATE_MOUSE_COORDS
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , TOGGLE_MAXIMIZE_INFO_PANEL
        , UNSET_TARGET
        , SET_PANE_TO_OPEN_INFO_PANEL
        , ADD_TOAST
        , DISMISS_TOAST
        , GET_TREE_INFO_IN_PROGRESS
        , GET_FEAT_NUM_PHOTOS_IN_PROGRESS
        , GET_FEAT_PHOTO_IN_PROGRESS
        , DEL_FEAT_PHOTO_IN_PROGRESS
        , GET_FEAT_PHOTO_SUCCESS
        , GET_TREE_INFO_SUCCESS
        , GET_FEAT_NUM_PHOTOS_SUCCESS
        , SET_TREE_INFO_ORIGINAL
        , SET_TREE_INFO_CURRENT
        , REVERT_TREE_INFO
        , SET_TREE_COORDS_ORIGINAL
        , SET_TREE_COORDS
        , REVERT_TREE_COORDS
        , GET_FEATURE_AJAX_CONCLUDED
        , NEW_TARGET
        , GET_REGIONS_IN_PROGRESS
        , GET_REGIONS_SUCCESS
        , UPDATE_SELECTED_REGIONS
        , SET_RGE_MODE
         , SET_WKT_REGION_UNDER_CONSTRUCTION
         , REG_MGMNT_DELETE_START
         , REG_MGMNT_DELETE_END
         , REG_MGMNT_MODIFY_START
         , REG_MGMNT_MODIFY_END

         , OVERLAPS_GET_REGIONS_SUCCESS
         , OVERLAPS_SET_REGION
         , OVERLAPS_SET_PARTITIONS
         , OVERLAPS_GET_OVERLAPS_IN_PROGRESS
         , OVERLAPS_GET_OVERLAPS_SUCCESS

         , OVERLAPS_UPDATE_SELECTED_REGION

         , UPDATE_CONFIGURATION
         , UPDATE_TREES
       } from './action-types.ts';

import getFeatData from './get-feat-data.tsx';

import getFeatNumPhotos from './get-feat-num-photos.tsx';

import {cancelPendingRequests} from './action-util.tsx';

import {INFORMATION, PHOTOS, HISTORY, ADJUST}                 from '../../constants/information-panel-panes.js';

import {ensureRGEModeIsValid} from '../constants/region-editing-mode.js';

import {isValidModalType
        , MDL_NOTIFICATION
        , MDL_NEW_REGION_DEFINITION
        , MDL_LOGIN} from '../../constants/modal-types.js';

import {tnu} from '../../util/util.js';



export function updateMouseCoords(latlng: string) : ActionUpdateMouseCoords {
    return { type: UPDATE_MOUSE_COORDS, payload: {latlng} };
}

export function displayModal(modalType: string, modalProps: any): StandardAction<any> {
    assert.isTrue(isValidModalType(modalType), `unrecognized modal type: [${modalType}]`);
    const {uuid} = modalProps;
    assert.exists(uuid, `actions/index.ts displayModal weird: ${tnu(uuid)}`);
    return {type: DISPLAY_MODAL, payload: {modalType, modalProps}};
}


export function displayModalLogin(f: ()=> void) : StandardAction<{uuid: string, followUpFunc: ()=> void}> {
    return displayModal(MDL_LOGIN, {uuid: uuidv4(), followUpFunc: f});
}


export function displayModalNotification(modalProps: any) {
    return displayModal(MDL_NOTIFICATION, Object.assign({}, modalProps, {uuid:  uuidv4()}));
}

export function displayModalNewRegionDefinition() {
    return displayModal(MDL_NEW_REGION_DEFINITION, {uuid: uuidv4()});
}

export function clearModal(uuid: string) : StandardAction<string>{
    assert.isDefined(uuid, `/redux/actions/index.ts :: clearModal(${uuid})`);
    assert.isNotNull(uuid, `/redux/actions/index.ts :: clearModal(${uuid})`);
    return {type: CLEAR_MODAL, payload: uuid};
}

export function toggleMaximizeInfoPanel(): ActionToggleMaximizeInfoPanel {
    return {type: TOGGLE_MAXIMIZE_INFO_PANEL};
}


export function unsetTarget(): ActionUnsetTarget {
    return {type: UNSET_TARGET};
};



export function unsetOrFetch(targetId: number) {
    return (dispatch: any, getState: any) => {
        cancelPendingRequests(getState());        
        if (getState().target.id === targetId) {
            dispatch(unsetTarget());
        } else {
            dispatch(newTarget(targetId));
            const pane = getState().paneToOpenInfoPanel;
            switch (pane) {
            case INFORMATION:
            case HISTORY:
            case ADJUST:
                dispatch(getFeatData(targetId));
                break;
            case PHOTOS:
                dispatch(getFeatNumPhotos(targetId));
                break;
            default:
                assert.fail(`unhandled pane: [${pane}]`);
            }
        }
    };
}

function newTarget(targetId: number) {
    return {type: NEW_TARGET, payload: {targetId}};
}

export function setPaneToOpenInfoPanel(pane: string) {
    return {type: SET_PANE_TO_OPEN_INFO_PANEL, payload: {pane}};
}

export function addToast(header: string, msg: string): StandardAction<{header: string, msg: string}> {
    return {type: ADD_TOAST, payload: {header, msg}};
}

export function dismissToast(id: number) {
    return {type: DISMISS_TOAST, payload: {id}};
}



export function getTreeInfoInProgress(id: number, axiosSource: any) {
    return {type: GET_TREE_INFO_IN_PROGRESS, payload: {id, axiosSource}};
}

export function getFeatNumPhotosInProgress(id: number, axiosSource: any) {
    return {type: GET_FEAT_NUM_PHOTOS_IN_PROGRESS, payload: {id, axiosSource}};
}

export function getFeatPhotoInProgress(id: number, idx: number, axiosSource: any) {
    return {type: GET_FEAT_PHOTO_IN_PROGRESS, payload: {id, idx, axiosSource}};
}


export function delFeatPhotoInProgress(id: number, idx: number) {
    return {type: DEL_FEAT_PHOTO_IN_PROGRESS, payload: {id, idx}};
}



export function getFeatureAjaxConcluded(): ActionGetFeatureAjaxConcluded {
    return {type: GET_FEATURE_AJAX_CONCLUDED};
}

export function getTreeInfoSuccess(treeInfo: any) {
    return {type: GET_TREE_INFO_SUCCESS, payload: treeInfo};
}

export function getFeatNumPhotosSuccess(num: number) {
    return {type: GET_FEAT_NUM_PHOTOS_SUCCESS, payload: num};
}

export function getFeatPhotoSuccess(img: any, t: any) {
    return {type: GET_FEAT_PHOTO_SUCCESS, payload: {img, t}};
}



export function setTreeInfoCurrent(treeInfo: any): ActionSetTreeInfoCurrent {
    return {type: SET_TREE_INFO_CURRENT, payload: treeInfo};
}

export function setTreeInfoOriginal(treeInfo: any): ActionSetTreeInfoOriginal {
    return {type: SET_TREE_INFO_ORIGINAL, payload: treeInfo};
}

export function revertTreeInfo(): ActionRevertTreeInfo {
    return {type: REVERT_TREE_INFO};
}


export function setTreeCoordsOriginal(coords: any) {
    return {type: SET_TREE_COORDS_ORIGINAL, payload: coords};
}

export function setTreeCoords(coords: any) {
    return {type: SET_TREE_COORDS, payload: coords};
}



export function revertTreeCoords(): ActionRevertTreeCoords {
    return {type: REVERT_TREE_COORDS};
}


export function getRegionsInProgress(): ActionGetRegionsInProgress {
    return {type: GET_REGIONS_IN_PROGRESS};
}


export function getRegionsSuccess(regions: any) {
    return {type: GET_REGIONS_SUCCESS, payload: regions};
}

export function updateSelectedRegions(selectedRegions: any) {
    console.log('updateSelectedRegions, regions are: ', selectedRegions);
    return {type: UPDATE_SELECTED_REGIONS, payload: selectedRegions};
}

export function overlapsUpdateSelectedRegion(selectedRegion: any) {
   return {type: OVERLAPS_UPDATE_SELECTED_REGION, payload: selectedRegion};
}


export {default as login} from './login.ts';

export {default as getFeatData}        from './get-feat-data.tsx';
export {default as getFeatPhoto}       from './get-feat-photo.tsx';
export {default as getFeatNumPhotos}   from './get-feat-num-photos.tsx';

export {default as saveFeatData}       from './save-feat-data.tsx';
export {default as delFeatPhoto}       from './del-feat-photo.tsx';

export {default as getRegions}       from './get-regions.tsx';

export function setRGEMode(mode: string) {
    console.log(`XXX setting rge mode to ${mode}`);
    ensureRGEModeIsValid(mode);
    return {type: SET_RGE_MODE, payload: mode};
}

export function setWktRegionUnderConstruction(wkt: string) {
    return {type: SET_WKT_REGION_UNDER_CONSTRUCTION, payload: wkt};
}

export {default as createRegion} from './create-region.tsx';

export function rgmgmntDeleteStart(): ActionNoPayload {
    return {type: REG_MGMNT_DELETE_START};
}

export function rgmgmntDeleteEnd(): ActionNoPayload {
    return {type: REG_MGMNT_DELETE_END};
}

export function rgmgmntModifyStart(): ActionNoPayload {
    return {type: REG_MGMNT_MODIFY_START};
}

export function rgmgmntModifyEnd(): ActionNoPayload {
    return {type: REG_MGMNT_MODIFY_END};
}




export function overlapsGetRegionsSuccess(regions: any)     {return {type: OVERLAPS_GET_REGIONS_SUCCESS, payload: regions};}
export function overlapsSetRegion        (region: any)      {return {type: OVERLAPS_SET_REGION, payload: region};}
export function overlapsSetPartitions    (partitions: any)  {return {type: OVERLAPS_SET_PARTITIONS, payload: partitions};}
export function overlapsGetOverlapsInProgress   ():ActionNoPayload     {return {type: OVERLAPS_GET_OVERLAPS_IN_PROGRESS};}
export function overlapsGetOverlapsSuccess(overlaps: any)   {return {type: OVERLAPS_GET_OVERLAPS_SUCCESS, payload: overlaps};}

export function updateConfiguration(configuration: any) {return {type: UPDATE_CONFIGURATION, payload: configuration};}
export function updateTrees(trees: any)                           {return {type: UPDATE_TREES, payload: trees};}

import getTrees from './get-trees.tsx';
export {default as getTrees} from './get-trees.tsx';
import getTreesConfiguration from './get-trees-configuration.tsx';
export {default as getTreesConfiguration} from './get-trees-configuration.tsx';


// cf. SSE-1592901297
export function getConfigurationAndTreesAndThen(f: ()=>void) {
    console.log('refetching trees and configuration');
    return (dispatch: React.Dispatch<any>) => {
        Promise.all([dispatch(getTrees(1000))
                     , dispatch(getTreesConfiguration())])
            .then(()=>{
                console.log('cag both promises fullfilled, calling function');
                f();
            });
    };
}
