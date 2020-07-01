//import chai from '../../util/chai-util.js';
//chai.Assertion.includeStack = true; // https://stackoverflow.com/a/13396945/274677

import {Dispatch} from 'react';

import chai from '../../util/chai-util.js';
const assert = chai.assert;
import { v4 as uuidv4 } from 'uuid';

import {TreeInfoWithId} from '../../backend.d.ts';
import {ActionTypeKeys} from './action-type-keys.ts';
import {ActionUpdateMouseCoords
        , ActionDisplayModal
        , ActionDisplayModalLogin
        , ActionDisplayModalNotification
        , ActionDisplayModalNewRegionDefinition
        , ActionClearModal
        , ActionSetPaneToOpenInfoPanel
        , ActionUnsetOrFetch
        , ActionNewTarget
        , ActionAddToast
        , ActionDismissToast
        , ActionGetTreeInfoInProgress
        , ActionGetFeatNumPhotosInProgress
        , ActionGetFeatPhotoInProgress
        , ActionGetTreeInfoSuccess
        , ActionGetFeatNumPhotosSuccess
        , ActionGetFeatPhotoSuccess
        , ActionSetTreeInfoCurrent
        , ActionSetTreeInfoOriginal
        , ActionRevertTreeInfo
        , ActionSetTreeCoordsOriginal
        , ActionSetTreeCoords
        , ActionRevertTreeCoords
        , ActionGetRegionsInProgress        
        , ActionGetRegionsSuccess        
        , ActionToggleMaximizeInfoPanel
        , ActionUnsetTarget
        , ActionGetFeatureAjaxConcluded
        , ActionDelFeatPhotoInProgress
        , ActionUpdateSelectedRegions
        , ActionOverlapsUpdateSelectedRegion
        , ActionOverlapsGetRegionsSuccess
        , ActionOverlapsSetRegion
        , ActionOverlapsSetPartitions
        , ActionOverlapsGetOverlapsInProgress
        , ActionOverlapsGetOverlapsSuccess
        , ActionUpdateConfiguration
        , ActionUpdateTrees
        , ActionRgmgmntDeleteStart
        , ActionRgmgmntDeleteEnd
        , ActionRgmgmntModifyStart
        , ActionRgmgmntModifyEnd} from './action-types.ts';


import getFeatData from './get-feat-data.tsx';

import getFeatNumPhotos from './get-feat-num-photos.tsx';

import {cancelPendingRequests} from './action-util.tsx';

import {InformationPanelPane} from '../../information-panel-tree.tsx';

import {ensureRGEModeIsValid} from '../constants/region-editing-mode.js';

import {isValidModalType
        , MDL_NOTIFICATION
        , MDL_NOTIFICATION_NO_DISMISS
        , MDL_NEW_REGION_DEFINITION
        , MDL_LOGIN} from '../../constants/modal-types.js';

import {tnu} from '../../util/util.js';

import {RootState} from '../types.ts';

export function updateMouseCoords(latlng: string) : ActionUpdateMouseCoords {
    return {type: ActionTypeKeys.UPDATE_MOUSE_COORDS, payload: {latlng}};
}

export function displayModal(modalType: string, modalProps: any): ActionDisplayModal {
    assert.isTrue(isValidModalType(modalType), `unrecognized modal type: [${modalType}]`);
    const {uuid} = modalProps;
    assert.exists(uuid, `actions/index.ts displayModal weird: ${tnu(uuid)}`);
    return {type: ActionTypeKeys.DISPLAY_MODAL, payload: {modalType, modalProps}};
}


export function displayModalLogin(f: ()=> void) : ActionDisplayModalLogin {
    return displayModal(MDL_LOGIN, {uuid: uuidv4(), followUpFunc: f});
}


export function displayModalNotification(html: string): ActionDisplayModalNotification {
    return displayModal(MDL_NOTIFICATION, {html, uuid: uuidv4()});
}

export function displayModalNotificationNonDismissable(html: string, uuid: string): ActionDisplayModalNotification { // NB: using the same type
    return displayModal(MDL_NOTIFICATION_NO_DISMISS, {html, uuid});
}

export function displayModalNewRegionDefinition(): ActionDisplayModalNewRegionDefinition {
    return displayModal(MDL_NEW_REGION_DEFINITION, {uuid: uuidv4()});
}

export function clearModal(uuid: string) : ActionClearModal {
    assert.isDefined(uuid, `/redux/actions/index.ts :: clearModal(${uuid})`);
    assert.isNotNull(uuid, `/redux/actions/index.ts :: clearModal(${uuid})`);
    return {type: ActionTypeKeys.CLEAR_MODAL, payload: uuid};
}

export function toggleMaximizeInfoPanel(): ActionToggleMaximizeInfoPanel {
    return {type: ActionTypeKeys.TOGGLE_MAXIMIZE_INFO_PANEL};
}


export function unsetTarget(): ActionUnsetTarget {
    return {type: ActionTypeKeys.UNSET_TARGET};
};

export function setPaneToOpenInfoPanel(pane: InformationPanelPane): ActionSetPaneToOpenInfoPanel {
    return {type: ActionTypeKeys.SET_PANE_TO_OPEN_INFO_PANEL, payload: {pane}};
}


export function unsetOrFetch(targetId: number) : ActionUnsetOrFetch {
    return (dispatch: Dispatch<any>, getState: ()=>RootState) => {
        cancelPendingRequests(getState());        
        if (getState().target.id === targetId) {
            dispatch(unsetTarget());
        } else {
            dispatch(newTarget(targetId));
            const pane = getState().paneToOpenInfoPanel;
            switch (pane) {
            case InformationPanelPane.INFORMATION:
            case InformationPanelPane.HISTORY:
            case InformationPanelPane.ADJUST:
                dispatch(getFeatData(targetId));
                break;
            case InformationPanelPane.PHOTOS:
                dispatch(getFeatNumPhotos(targetId));
                break;
            default:
                assert.fail(`unhandled pane: [${pane}]`);
            }
        }
    };
}

function newTarget(targetId: number): ActionNewTarget {
    return {type: ActionTypeKeys.NEW_TARGET, payload: {targetId}};
}


export function addToast(header: string, msg: string): ActionAddToast {
    return {type: ActionTypeKeys.ADD_TOAST, payload: {header, msg}};
}

export function dismissToast(id: number): ActionDismissToast {
    return {type: ActionTypeKeys.DISMISS_TOAST, payload: {id}};
}


export function getTreeInfoInProgress(id: number, axiosSource: any): ActionGetTreeInfoInProgress {
    return {type: ActionTypeKeys.GET_TREE_INFO_IN_PROGRESS, payload: {id, axiosSource}};
}

export function getFeatNumPhotosInProgress(id: number, axiosSource: any): ActionGetFeatNumPhotosInProgress {
    return {type: ActionTypeKeys.GET_FEAT_NUM_PHOTOS_IN_PROGRESS, payload: {id, axiosSource}};
}

export function getFeatPhotoInProgress(id: number, idx: number, axiosSource: any): ActionGetFeatPhotoInProgress {
    return {type: ActionTypeKeys.GET_FEAT_PHOTO_IN_PROGRESS, payload: {id, idx, axiosSource}};
}


export function delFeatPhotoInProgress(id: number, idx: number): ActionDelFeatPhotoInProgress {
    return {type: ActionTypeKeys.DEL_FEAT_PHOTO_IN_PROGRESS, payload: {id, idx}};
}


export function getFeatureAjaxConcluded(): ActionGetFeatureAjaxConcluded {
    return {type: ActionTypeKeys.GET_FEAT_AJAX_CONCLUDED};
}

export function getTreeInfoSuccess(treeInfo: TreeInfoWithId): ActionGetTreeInfoSuccess {
    return {type: ActionTypeKeys.GET_TREE_INFO_SUCCESS, payload: treeInfo};
}

export function getFeatNumPhotosSuccess(num: number): ActionGetFeatNumPhotosSuccess {
    return {type: ActionTypeKeys.GET_FEAT_NUM_PHOTOS_SUCCESS, payload: num};
}

export function getFeatPhotoSuccess(img: any, t: any): ActionGetFeatPhotoSuccess {
    return {type: ActionTypeKeys.GET_FEAT_PHOTO_SUCCESS, payload: {img, t}};
}

export function revertTreeInfo(): ActionRevertTreeInfo {
    return {type: ActionTypeKeys.REVERT_TREE_INFO};
}

export function setTreeInfoCurrent(treeInfo: any): ActionSetTreeInfoCurrent {
    return {type: ActionTypeKeys.SET_TREE_INFO_CURRENT, payload: treeInfo};
}

export function setTreeInfoOriginal(treeInfo: any): ActionSetTreeInfoOriginal {
    return {type: ActionTypeKeys.SET_TREE_INFO_ORIGINAL, payload: treeInfo};
}



export function setTreeCoordsOriginal(coords: any): ActionSetTreeCoordsOriginal {
    return {type: ActionTypeKeys.SET_TREE_COORDS_ORIGINAL, payload: coords};
}

export function setTreeCoords(coords: any): ActionSetTreeCoords {
    return {type: ActionTypeKeys.SET_TREE_COORDS, payload: coords};
}

export function revertTreeCoords(): ActionRevertTreeCoords {
    return {type: ActionTypeKeys.REVERT_TREE_COORDS};
}

export function getRegionsInProgress(): ActionGetRegionsInProgress {
    return {type: ActionTypeKeys.GET_REGIONS_IN_PROGRESS};
}


export function getRegionsSuccess(regions: any): ActionGetRegionsSuccess {
    return {type: ActionTypeKeys.GET_REGIONS_SUCCESS, payload: regions};
}

export function updateSelectedRegions(selectedRegions: any): ActionUpdateSelectedRegions {
    console.log('updateSelectedRegions, regions are: ', selectedRegions);
    return {type: ActionTypeKeys.UPDATE_SELECTED_REGIONS, payload: selectedRegions};
}

export function overlapsUpdateSelectedRegion(selectedRegion: any): ActionOverlapsUpdateSelectedRegion {
   return {type: ActionTypeKeys.OVERLAPS_UPDATE_SELECTED_REGION, payload: selectedRegion};
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
    return {type: ActionTypeKeys.SET_RGE_MODE, payload: mode};
}

export function setWktRegionUnderConstruction(wkt: string) {
    return {type: ActionTypeKeys.SET_WKT_REGION_UNDER_CONSTRUCTION, payload: wkt};
}

export {default as createRegion} from './create-region.tsx';

export function rgmgmntDeleteStart(): ActionRgmgmntDeleteStart {
    return {type: ActionTypeKeys.REG_MGMNT_DELETE_START};
}

export function rgmgmntDeleteEnd(): ActionRgmgmntDeleteEnd {
    return {type: ActionTypeKeys.REG_MGMNT_DELETE_END};
}

export function rgmgmntModifyStart(): ActionRgmgmntModifyStart {
    return {type: ActionTypeKeys.REG_MGMNT_MODIFY_START};
}

export function rgmgmntModifyEnd(): ActionRgmgmntModifyEnd {
    return {type: ActionTypeKeys.REG_MGMNT_MODIFY_END};
}

export function overlapsGetRegionsSuccess(regions: any): ActionOverlapsGetRegionsSuccess {
    return {type: ActionTypeKeys.OVERLAPS_GET_REGIONS_SUCCESS, payload: regions};
}

export function overlapsSetRegion(region: any): ActionOverlapsSetRegion {
    return {type: ActionTypeKeys.OVERLAPS_SET_REGION, payload: region};
}

export function overlapsSetPartitions (partitions: any): ActionOverlapsSetPartitions {
    return {type: ActionTypeKeys.OVERLAPS_SET_PARTITIONS, payload: partitions};
}

export function overlapsGetOverlapsInProgress   (): ActionOverlapsGetOverlapsInProgress {
    return {type: ActionTypeKeys.OVERLAPS_GET_OVERLAPS_IN_PROGRESS};
}

export function overlapsGetOverlapsSuccess(overlaps: any): ActionOverlapsGetOverlapsSuccess {
    return {type: ActionTypeKeys.OVERLAPS_GET_OVERLAPS_SUCCESS, payload: overlaps};
}

export function updateConfiguration(configuration: any): ActionUpdateConfiguration { // TODO: this can be alot more speciific
    return {type: ActionTypeKeys.UPDATE_CONFIGURATION, payload: configuration};
}

export function updateTrees(trees: any): ActionUpdateTrees {
    return {type: ActionTypeKeys.UPDATE_TREES, payload: trees};
}

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
