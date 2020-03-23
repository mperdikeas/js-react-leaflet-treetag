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

import {SELECT_TREE, DEFINE_POLYGON} from '../constants/modes.js';

import _ from 'lodash';

const assert = require('chai').assert;
import tileProviderReducer            from './tileProviderReducer.js';
import mouseCoordsReducer             from './mouseCoordsReducer.js';
import toggleModeReducer              from './toggleModeReducer.js';
import updateTargetReducer            from './updateTargetReducer.js';
import addGeometryReducer             from './addGeometryReducer.js';
import flagsReducer                   from './flagsReducer.js';
import geometryUnderDefinitionReducer from './geometryUnderDefinitionReducer.js';
import modalReducer                   from './modalReducer.js';
import maximizedInfoPanelReducer      from './maximizedInfoPanelReducer.js';


function rootReducer(state = {}, action) {
    return {
        tileProviderId       : tileProviderReducer      (state.tileProviderId, action),
        latlng               : mouseCoordsReducer       (state.latlng, action),
        mode                 : toggleModeReducer        (state.mode, action),
        targetId             : updateTargetReducer      (state.targetId, action),
        userDefinedGeometries: addGeometryReducer       (state.userDefinedGeometries, action),
        flags                : flagsReducer             (state.flags, embellishActionForFlagsReducer(action, state)),
        geometryUnderDefinition: geometryUnderDefinitionReducer(state.geometryUnderDefinition, embellishActionForGeometryUnderDefinitionReducer(action, state)),
        modalType            : modalReducer             (state.modalType, action),
        maximizedInfoPanel   : maximizedInfoPanelReducer(state.maximizedInfoPanel, action)
    };
};

function embellishActionForFlagsReducer(action, state) {
    return {
        action: action
        , state: {mode: state.mode}
    };
}

function embellishActionForGeometryUnderDefinitionReducer(action, state) {
    return {
        action: action
        , state: {mode: state.mode}
    };
}

export default rootReducer;
