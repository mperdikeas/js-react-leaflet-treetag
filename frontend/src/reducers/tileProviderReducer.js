import {CHANGE_TILE_PROVIDER} from '../constants/action-types.js';
export default (state = 'esri', action) => {
    switch (action.type) {
    case CHANGE_TILE_PROVIDER:
        return action.payload.tileProviderId;
    default:
        return state;
    }
}
