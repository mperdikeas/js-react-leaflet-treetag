import {CHANGE_TILE_PROVIDER, UPDATE_MOUSE_COORDS} from '../constants/action-types.js';

export function changeTileProvider(tileProviderId) {
    return { type: CHANGE_TILE_PROVIDER, payload: {tileProviderId} };
};

export function updateMouseCoords(latlng) {
    return { type: UPDATE_MOUSE_COORDS, payload: {latlng} };
};

/*
export function selectTarget(tileProviderId) {
    return { type: CHANGE_TILE_PROVIDER, tileProviderId };
};
*/
