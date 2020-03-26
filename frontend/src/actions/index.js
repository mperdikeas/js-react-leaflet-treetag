const assert = require('chai').assert;
import {CHANGE_TILE_PROVIDER
        , UPDATE_MOUSE_COORDS
        , SET_FLAG
        , CLEAR_FLAG
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , TOGGLE_MAXIMIZE_INFO_PANEL
        , UPDATE_TARGET} from '../constants/action-types.js';
import {isValidModalType} from '../constants/modal-types.js';

import {CT_UNIT} from '../constants.js';

export function changeTileProvider(tileProviderId) {
    return { type: CHANGE_TILE_PROVIDER, payload: {tileProviderId} };
}

export function updateMouseCoords(latlng) {
    return { type: UPDATE_MOUSE_COORDS, payload: {latlng} };
}

export function clearFlag(flagToClear) {
    return {type: CLEAR_FLAG, payload: {flagToClear}};
}

export function setFlag(flagToSet, flagValue=CT_UNIT) {
    assert.isNotNull(flagValue);
    assert.isDefined(flagValue);
    console.log(`dispatching flag [${flagToSet}] with flag value [${flagValue}]`); 
    return {type: SET_FLAG, payload: {flagToSet, flagValue}};
}

export function displayModal(modalType, modalProps) {
    console.log('dispatching modal');
    assert.isTrue(isValidModalType(modalType), `unrecognized modal type: [${modalType}]`);
    return {type: DISPLAY_MODAL, payload: {modalType, modalProps}};
}

export function clearModal() {
    return {type: CLEAR_MODAL};
}

export function toggleMaximizeInfoPanel() {
    return {type: TOGGLE_MAXIMIZE_INFO_PANEL, payload: null};
}

export function updateTarget(targetId) {
    return {type: UPDATE_TARGET, payload: {targetId}};
}
