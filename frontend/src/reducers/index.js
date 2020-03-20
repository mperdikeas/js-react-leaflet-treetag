// import {CHANGE_TILE_PROVIDER, SELECT_TARGET} from '../constants/action-types.js';
import {CHANGE_TILE_PROVIDER, UPDATE_MOUSE_COORDS} from '../constants/action-types.js';

const initialState = {
    tileProviderId: 'esri'
    , latlng: null
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
    case CHANGE_TILE_PROVIDER:
        return Object.assign({}, state,
                             {tileProviderId: action.payload.tileProviderId});
    case UPDATE_MOUSE_COORDS:
        return Object.assign({}, state,
                             {latlng: action.payload.latlng});
    default:
        return state;        
    }
};

export default rootReducer;
