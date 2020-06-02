const assert = require('chai').assert;
import {APP_IS_DONE_LOADING
        , UPDATE_MOUSE_COORDS
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , TOGGLE_MAXIMIZE_INFO_PANEL
        , UNSET_TARGET
        , SET_PANE_TO_OPEN_INFO_PANEL
        , ADD_TOAST
        , DISMISS_TOAST

        , GET_TREE_INFO_IN_PROGRESS
        , GET_TREE_INFO_CONCLUDED
        , GET_TREE_INFO_SUCCESS


        , SET_TREE_INFO_ORIGINAL
        , SET_TREE_INFO_CURRENT
        , REVERT_TREE_INFO
        , SET_TREE_COORDS_ORIGINAL
        , SET_TREE_COORDS
        , REVERT_TREE_COORDS
       } from './action-types.js';

import {CancelToken} from 'axios';

import getFeatureData from './get-feature-data.jsx';

import {isValidModalType} from '../../constants/modal-types.js';

import {CT_UNIT} from '../../constants.js';



export function appIsDoneLoading() {
    return {type: APP_IS_DONE_LOADING, payload: null};
}

export function updateMouseCoords(latlng) {
    return { type: UPDATE_MOUSE_COORDS, payload: {latlng} };
}

export function displayModal(modalType, modalProps) {
    console.log(`bac - displaying modal ${modalType}`);
    assert.isTrue(isValidModalType(modalType), `unrecognized modal type: [${modalType}]`);
    return {type: DISPLAY_MODAL, payload: {modalType, modalProps}};
}

export function clearModal() {
    console.log('clearModal action');
    return {type: CLEAR_MODAL, payload: null};
}

export function toggleMaximizeInfoPanel() {
    return {type: TOGGLE_MAXIMIZE_INFO_PANEL, payload: null};
}


export function unsetTarget() {
    return {type: UNSET_TARGET, payload: undefined};
};

export function toggleTargetDELME(targetId) {
    return {type: TOGGLE_TARGET, payload: {targetId}};
};

export function fetchTreeInfo(targetId) {

};

import {INFORMATION, PHOTOS, HISTORY, ADJUST}                 from '../../constants/information-panel-panes.js';

export function unsetOrFetch(targetId) {
    return (dispatch, getState) => {
        if (getState().targetId === targetId)
            dispatch(unsetTarget());
        else {
            switch (getState().paneToOpenInfoPanel) {
            case INFORMATION:
            case ADJUST:
                dispatch(getFeatureData(targetId));
                break;
            case PHOTOS:
            case HISTORY:

            default:
                assert.fail(`unhandled pane: [${getState().paneToOpenInfoPanel}]`);
            }
        }
    };
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

export function getTreeInfoConcluded() {
    return {type: GET_TREE_INFO_CONCLUDED, payload: undefined};
}

export function getTreeInfoSuccess(treeInfo) {
    return {type: GET_TREE_INFO_SUCCESS, payload: treeInfo};
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

export {default as login} from './login.js';


