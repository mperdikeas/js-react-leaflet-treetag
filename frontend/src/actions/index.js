const assert = require('chai').assert;
import {UPDATE_MOUSE_COORDS
        , SET_FLAG
        , CLEAR_FLAG
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , TOGGLE_MAXIMIZE_INFO_PANEL
        , TOGGLE_TARGET
        , SET_PANE_TO_OPEN_INFO_PANEL} from '../constants/action-types.js';

import {isValidModalType} from '../constants/modal-types.js';

import {CT_UNIT} from '../constants.js';

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
    console.log(modalProps);
    console.log(`asdfadfasd displayModal(${modalType}, ${JSON.stringify(modalProps)}`);
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
}

export function setPaneToOpenInfoPanel(pane) {
    return {type: SET_PANE_TO_OPEN_INFO_PANEL, payload: {pane}};
}
