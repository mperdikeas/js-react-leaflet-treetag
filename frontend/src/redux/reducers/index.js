import {CHANGE_TILE_PROVIDER
        , UPDATE_MOUSE_COORDS
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , TOGGLE_MAXIMIZE_INFO_PANEL
        , UPDATE_TARGET} from '../actions/action-types.js';

const assert = require('chai').assert;

import toastReducer                   from './toastReducer.js';
import mouseCoordsReducer             from './mouseCoordsReducer.js';
import toggleTargetReducer            from './toggleTargetReducer.js';
import modalReducer                   from './modalReducer.js';
import maximizedInfoPanelReducer      from './maximizedInfoPanelReducer.js';
import paneToOpenInfoPanelReducer     from './paneToOpenInfoPanelReducer.js';
import treeInfoReducer                from './treeInfoReducer.js';


function rootReducer(state = {}, action) {
    const rv = {
        toasts               : toastReducer                (state.toasts, action),
        latlng               : mouseCoordsReducer          (state.latlng, action),
        targetId             : toggleTargetReducer         (state.targetId, action),
        modals               : modalReducer                (state.modals, action),
        maximizedInfoPanel   : maximizedInfoPanelReducer   (state.maximizedInfoPanel, action),
        paneToOpenInfoPanel  : paneToOpenInfoPanelReducer  (state.paneToOpenInfoPanel, action),
        treeInfo             : treeInfoReducer             (state.treeInfo, action)
    };
    return rv;
};


export default rootReducer;
