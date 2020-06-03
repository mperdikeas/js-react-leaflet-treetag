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
        , GET_FEAT_NUM_PHOTOS_IN_PROGRESS
        , GET_FEAT_PHOTO_IN_PROGRESS
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
        
       } from './action-types.js';

import {CancelToken} from 'axios';

import getFeatData from './get-feat-data.jsx';

import getFeatNumOfPhotos from './get-feat-num-photos.jsx';


import {isValidModalType} from '../../constants/modal-types.js';

import {CT_UNIT} from '../../constants.js';

import {cancelToken} from '../selectors.js';

import {INFORMATION, PHOTOS, HISTORY, ADJUST}                 from '../../constants/information-panel-panes.js';

import {OP_NO_LONGER_RELEVANT} from '../../constants/axios-constants.js';

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



export function unsetOrFetch(targetId) {
    return (dispatch, getState) => {
        if (getState().target.id === targetId) {
            /* If there are any pending axios requests we have to cancel them.
             */
            const cancelTokenV = cancelToken(getState());
            if (cancelTokenV) {
                cancelTokenV.cancel(OP_NO_LONGER_RELEVANT);
                console.log('cancelled axios GET request due to unsetting of target');
            } else
                console.log('no cancel token found');
            dispatch(unsetTarget());
        } else {
            dispatch(newTarget(targetId));
            const pane = getState().paneToOpenInfoPanel;
            console.log(`abe pane = ${pane}`);
            switch (pane) {
            case INFORMATION:
            case HISTORY:
            case ADJUST:
                dispatch(getFeatData(targetId));
                break;
            case PHOTOS:
                dispatch(getFeatNumOfPhotos(targetId));
                break;
            default:
                assert.fail(`unhandled pane: [${pane}]`);
            }
        }
    };
}

function newTarget(targetId) {
    console.log('abe dispatch newtarget');
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

export {default as login} from './login.js';

export {default as getFeatData}        from './get-feat-data.jsx';
export {default as getFeatPhoto}       from './get-feat-photo.jsx';
export {default as getFeatNumOfPhotos} from './get-feat-num-photos.jsx';

export {default as saveFeatData}       from './save-feat-data.jsx';

