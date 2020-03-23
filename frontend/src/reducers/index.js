// import {CHANGE_TILE_PROVIDER, SELECT_TARGET} from '../constants/action-types.js';
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

const initialState = {
    tileProviderId: 'esri'
    , latlng: null
    , mode: SELECT_TREE
    , targetId: null
    , userDefinedGeometries: []
    , geometryUnderDefinition: []
    , flags: {
        DELETE_GEOMETRY_UNDER_DEFINITION: false
    }
    , modalType: 'login'
    , maximizedInfoPanel: false
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
    case CHANGE_TILE_PROVIDER:
        return Object.assign({}, state,
                             {tileProviderId: action.payload.tileProviderId});
    case UPDATE_MOUSE_COORDS:
        return Object.assign({}, state,
                             {latlng: action.payload.latlng});
    case TOGGLE_MODE:
        const currentMode = state.mode;
        if ((currentMode === action.payload.mode) && (currentMode === DEFINE_POLYGON))
            return Object.assign({}, state
                                 , {mode: null
                                    , geometryUnderDefinition: []
                                    , flags: {DELETE_GEOMETRY_UNDER_DEFINITION: true}});
        else if (currentMode === action.payload.mode)
            return Object.assign({}, state, {mode: null});
        else
            return Object.assign({}, state, {mode: action.payload.mode});
    case CLEAR_FLAG:
        const flags = _.cloneDeep(state.flags);
        console.log(`xxx, flags was`);
        console.log(flags);
        flags[action.payload.flagToClear] = false;
        const rv = Object.assign({}, state, {flags});
        console.log(`xxx, flags became`);
        console.log(flags);
        return rv;
    case ADD_POINT_TO_POLYGON_UNDER_CONSTRUCTION:
        const geometryUnderDefinition = _.cloneDeep(state.geometryUnderDefinition);
        geometryUnderDefinition.push(action.payload.latlng);
        return Object.assign({}, state, {geometryUnderDefinition});
        // TODO - use this idiom: this.setState({geometryUnderDefinition: [...this.state.geometryUnderDefinition, {lat, lng}]});
    case DISPLAY_MODAL:
        return Object.assign({}, state, {modalType: action.payload.modalType});
    case CLEAR_MODAL:
        return Object.assign({}, state, {modalType: null});
    case ADD_GEOMETRY:
        return Object.assign({}, state, {modalType: null
                                         , geometryUnderDefinition: []
                                         , userDefinedGeometries: [...state.userDefinedGeometries
                                                                   , {geometryName: action.payload.geometryName
                                                                      , points: action.payload.points}]});
    case TOGGLE_MAXIMIZE_INFO_PANEL:
        return Object.assign({}, state, {maximizedInfoPanel: !state.maximizedInfoPanel});
    case UPDATE_TARGET:
        assert.strictEqual(state.mode, SELECT_TREE);
        return Object.assign({}, state, {targetId: action.payload.targetId});
    default:
        return state;        
    }
};

export default rootReducer;
