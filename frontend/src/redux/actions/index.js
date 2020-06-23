//import chai from '../../util/chai-util.js';
//chai.Assertion.includeStack = true; // https://stackoverflow.com/a/13396945/274677

import chai from '../../util/chai-util.js';
const assert = chai.assert;
import { v4 as uuidv4 } from 'uuid';

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
        , GET_REGIONS_CONCLUDED
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
       } from './action-types.js';

import {CancelToken} from 'axios';

import getFeatData from './get-feat-data.jsx';

import getFeatNumPhotos from './get-feat-num-photos.jsx';


import {isValidModalType} from '../../constants/modal-types.js';

import {CT_UNIT} from '../../constants.js';

import {cancelPendingRequests} from './action-util.jsx';

import {INFORMATION, PHOTOS, HISTORY, ADJUST}                 from '../../constants/information-panel-panes.js';

import {ensureRGEModeIsValid} from '../constants/region-editing-mode.js';

import {MDL_NOTIFICATION
        , MDL_NEW_REGION_DEFINITION} from '../../constants/modal-types.js';

import {tnu} from '../../util/util.js';


export function updateMouseCoords(latlng) {
    return { type: UPDATE_MOUSE_COORDS, payload: {latlng} };
}

export function displayModal(modalType, modalProps) {
    assert.isTrue(isValidModalType(modalType), `unrecognized modal type: [${modalType}]`);
    const {uuid} = modalProps;
    assert.exists(uuid, `actions/index.js displayModal weird: ${tnu(uuid)}`);
    return {type: DISPLAY_MODAL, payload: {modalType, modalProps}};
}



export function displayModalNotification(modalProps) {
    return displayModal(MDL_NOTIFICATION, Object.assign({}, modalProps, {uuid:  uuidv4()}));
}

export function displayModalNewRegionDefinition() {
    return displayModal(MDL_NEW_REGION_DEFINITION, {uuid: uuidv4()});
}

export function displayModalEnterPartitionName(partitions) {
    return displayModal(MDL_ENTER_PARTITION_NAME, {uuid:  uuidv4(), partitions});
}

export function clearModal(uuid) {
    assert.isDefined(uuid, `/redux/actions/index.js :: clearModal(${uuid})`);
    assert.isNotNull(uuid, `/redux/actions/index.js :: clearModal(${uuid})`);
    return {type: CLEAR_MODAL, payload: uuid};
}

export function toggleMaximizeInfoPanel() {
    return {type: TOGGLE_MAXIMIZE_INFO_PANEL, payload: null};
}


export function unsetTarget() {
    return {type: UNSET_TARGET, payload: undefined};
};



export function unsetOrFetch(targetId) {
    return (dispatch, getState) => {
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

function newTarget(targetId) {
    return {type: NEW_TARGET, payload: {targetId}};
}

export function setPaneToOpenInfoPanel(pane) {
    return {type: SET_PANE_TO_OPEN_INFO_PANEL, payload: {pane}};
}

export function addToast(header, msg) {
    return {type: ADD_TOAST, payload: {header, msg}};
}

export function dismissToast(id) {
    return {type: DISMISS_TOAST, payload: {id}};
}



export function getTreeInfoInProgress(id, axiosSource) {
    return {type: GET_TREE_INFO_IN_PROGRESS, payload: {id, axiosSource}};
}

export function getFeatNumPhotosInProgress(id, axiosSource) {
    return {type: GET_FEAT_NUM_PHOTOS_IN_PROGRESS, payload: {id, axiosSource}};
}

export function getFeatPhotoInProgress(id, idx, axiosSource) {
    return {type: GET_FEAT_PHOTO_IN_PROGRESS, payload: {id, idx, axiosSource}};
}


export function delFeatPhotoInProgress(id, idx) {
    return {type: DEL_FEAT_PHOTO_IN_PROGRESS, payload: {id, idx}};
}



export function getFeatureAjaxConcluded() {
    return {type: GET_FEATURE_AJAX_CONCLUDED, payload: undefined};
}

export function getTreeInfoSuccess(treeInfo) {
    return {type: GET_TREE_INFO_SUCCESS, payload: treeInfo};
}

export function getFeatNumPhotosSuccess(num) {
    return {type: GET_FEAT_NUM_PHOTOS_SUCCESS, payload: num};
}

export function getFeatPhotoSuccess(img, t) {
    return {type: GET_FEAT_PHOTO_SUCCESS, payload: {img, t}};
}



export function markGetFeatureInfoFailed() {
    return {type: MARK_GET_FEATURE_INFO_FAILED, payload: null};
}

export function setTreeInfoCurrent(treeInfo) {
    return {type: SET_TREE_INFO_CURRENT, payload: treeInfo};
}

export function setTreeInfoOriginal(treeInfo) {
    return {type: SET_TREE_INFO_ORIGINAL, payload: treeInfo};
}

export function revertTreeInfo() {
    return {type: REVERT_TREE_INFO, payload: null};
}


export function setTreeCoordsOriginal(coords) {
    return {type: SET_TREE_COORDS_ORIGINAL, payload: coords};
}

export function setTreeCoords(coords) {
    return {type: SET_TREE_COORDS, payload: coords};
}

export function revertTreeCoords() {
    return {type: REVERT_TREE_COORDS, payload: null};
}


export function getRegionsInProgress() {
    return {type: GET_REGIONS_IN_PROGRESS, payload: null};
}


export function getRegionsSuccess(regions) {
    return {type: GET_REGIONS_SUCCESS, payload: regions};
}

export function updateSelectedRegions(selectedRegions) {
    return {type: UPDATE_SELECTED_REGIONS, payload: selectedRegions};
}

export function overlapsUpdateSelectedRegion(selectedRegion) {
   return {type: OVERLAPS_UPDATE_SELECTED_REGION, payload: selectedRegion};
}


export {default as login} from './login.js';

export {default as getFeatData}        from './get-feat-data.jsx';
export {default as getFeatPhoto}       from './get-feat-photo.jsx';
export {default as getFeatNumPhotos}   from './get-feat-num-photos.jsx';

export {default as saveFeatData}       from './save-feat-data.jsx';
export {default as delFeatPhoto}       from './del-feat-photo.jsx';

export {default as getRegions}       from './get-regions.jsx';

export function setRGEMode(mode) {
    console.log(`XXX setting rge mode to ${mode}`);
    ensureRGEModeIsValid(mode);
    return {type: SET_RGE_MODE, payload: mode};
}

export function setWktRegionUnderConstruction(wkt) {
    return {type: SET_WKT_REGION_UNDER_CONSTRUCTION, payload: wkt};
}

export {default as createRegion} from './create-region.jsx';

export function rgmgmntDeleteStart() {
    return {type: REG_MGMNT_DELETE_START, payload: null};
}

export function rgmgmntDeleteEnd() {
    return {type: REG_MGMNT_DELETE_END, payload: null};
}

export function rgmgmntModifyStart() {
    return {type: REG_MGMNT_MODIFY_START, payload: null};
}

export function rgmgmntModifyEnd() {
    return {type: REG_MGMNT_MODIFY_END, payload: null};
}




export function overlapsGetRegionsSuccess(regions)     {return {type: OVERLAPS_GET_REGIONS_SUCCESS, payload: regions};}
export function overlapsSetRegion        (region)      {return {type: OVERLAPS_SET_REGION, payload: region};}
export function overlapsSetPartitions    (partitions)  {return {type: OVERLAPS_SET_PARTITIONS, payload: partitions};}
export function overlapsGetOverlapsInProgress   ()     {return {type: OVERLAPS_GET_OVERLAPS_IN_PROGRESS, payload: null};}
export function overlapsGetOverlapsSuccess(overlaps)   {return {type: OVERLAPS_GET_OVERLAPS_IN_PROGRESS, payload: overlaps};}

export function updateConfiguration(configuration) {return {type: UPDATE_CONFIGURATION, payload: configuration};}
export function updateTrees(trees)                           {return {type: UPDATE_TREES, payload: trees};}

import getTrees from './get-trees.jsx';
export {default as getTrees} from './get-trees.jsx';
import getTreesConfiguration from './get-trees-configuration.jsx';
export {default as getTreesConfiguration} from './get-trees-configuration.jsx';


// cf. SSE-1592901297
export function getConfigurationAndTreesAndThen(f) {
    console.log('refetching trees and configuration');
    return (dispatch) => {
        Promise.all([dispatch(getTrees(1000))
                     , dispatch(getTreesConfiguration())])
            .then(()=>{
                console.log('cag both promises fullfilled, calling function');
                f();
            });
    };
}
