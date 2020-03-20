import {CHANGE_TILE_PROVIDER} from '../constants/action-types.js';

const initialState = {
    tileProviderId: 'esri'
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
    case CHANGE_TILE_PROVIDER:
        return Object.assign({}, state,
                             {tileProviderId: action.tileProviderId});
    default:
        return state;        
    }
};

export default rootReducer;
