import {CHANGE_TILE_PROVIDER
        , UPDATE_MOUSE_COORDS
        , TOGGLE_MODE
        , CLEAR_FLAG
        , ADD_POINT_TO_POLYGON_UNDER_CONSTRUCTION
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , ADD_GEOMETRY} from '../constants/action-types.js';

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

export function displayModal(modalType) {
    return {type: DISPLAY_MODAL, payload: {modalType}};
}

export function clearModal() {
    return {type: CLEAR_MODAL};
}

export function addGeometry(geometryName, points) {
    return {type: ADD_GEOMETRY, payload: {geometryName, points}};
}
