const assert = require('chai').assert;
import {CHANGE_TILE_PROVIDER
        , UPDATE_MOUSE_COORDS
        , TOGGLE_MODE
        , CLEAR_FLAG
        , ADD_POINT_TO_POLYGON_UNDER_CONSTRUCTION
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , ADD_GEOMETRY
        , TOGGLE_MAXIMIZE_INFO_PANEL
        , UPDATE_TARGET} from '../constants/action-types.js';
import {isValidModalType} from '../constants/modal-types.js';

export function changeTileProvider(tileProviderId) {
    return { type: CHANGE_TILE_PROVIDER, payload: {tileProviderId} };
}

export function updateMouseCoords(latlng) {
    return { type: UPDATE_MOUSE_COORDS, payload: {latlng} };
}

export function toggleMode(mode) {
    return { type: TOGGLE_MODE, payload: {mode} };
}

export function clearFlag(flagToClear) {
    return {type: CLEAR_FLAG, payload: {flagToClear}};
}

export function addPointToPolygonUnderConstruction(latlng) {
    return {type: ADD_POINT_TO_POLYGON_UNDER_CONSTRUCTION, payload: {latlng}};
}

export function displayModal(modalType, polygon) {
    console.log('dispatching modal');
    assert.isTrue(isValidModalType(modalType), `unrecognized modal type: ${modalType}`);
    return {type: DISPLAY_MODAL, payload: {modalType, modalProps: {polygon}}};
}

export function clearModal() {
    return {type: CLEAR_MODAL};
}

export function addGeometry(geometryName, points) {
    return {type: ADD_GEOMETRY, payload: {geometryName, points}};
}

export function toggleMaximizeInfoPanel() {
    return {type: TOGGLE_MAXIMIZE_INFO_PANEL, payload: null};
}

export function updateTarget(targetId) {
    return {type: UPDATE_TARGET, payload: {targetId}};
}
