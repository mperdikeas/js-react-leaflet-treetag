const assert = require('chai').assert;
import {APP_IS_DONE_LOADING
        , UPDATE_MOUSE_COORDS
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , TOGGLE_MAXIMIZE_INFO_PANEL
        , TOGGLE_TARGET
        , SET_PANE_TO_OPEN_INFO_PANEL
        , ADD_TOAST
        , DISMISS_TOAST
        , MARK_GET_FEATURE_INFO_IN_PROGRESS
        , MARK_GET_FEATURE_INFO_FAILED
        , SET_TREE_INFO_ORIGINAL
        , SET_TREE_INFO
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


export function toggleTarget(targetId) {
    return {type: TOGGLE_TARGET, payload: {targetId}};
};


export function toggleTargetAndOptionallyFetchData(targetId) {
    return (dispatch, getState) => {
        /* If the current target is the same, simply toggle the target and do nothing
           else. Otherwise toggle the target AND dispatch a getFeatureData action */
        if (getState().targetId === targetId)
            dispatch(toggleTarget(targetId));
        else {
            console.log(`abd - case 2`);
            dispatch(toggleTarget(targetId));
            console.log(`abd - getting feature data for target ${targetId}`);
            dispatch(getFeatureData(targetId));
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



/* TODO: if these actions are only used from get-feature-data maybe they
 * can stop being independent actions
 */
export function markGetFeatureInfoInProgress(axiosSource) {
    return {type: MARK_GET_FEATURE_INFO_IN_PROGRESS, payload: {axiosSource}};
}

export function setTreeInfoOriginal(treeInfo) {
    return {type: SET_TREE_INFO_ORIGINAL, payload: treeInfo};
}

export function markGetFeatureInfoFailed() {
    return {type: MARK_GET_FEATURE_INFO_FAILED, payload: null};
}

export function setTreeInfo(treeInfo) {
    return {type: SET_TREE_INFO, payload: treeInfo};
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


