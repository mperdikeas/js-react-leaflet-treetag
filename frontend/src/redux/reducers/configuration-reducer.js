import {UPDATE_CONFIGURATION} from '../actions/action-type-keys.ts';
export default (state = undefined, action) => {
    switch (action.type) {
    case UPDATE_CONFIGURATION:
        return action.payload;
    default:
        return state;
    }
}
