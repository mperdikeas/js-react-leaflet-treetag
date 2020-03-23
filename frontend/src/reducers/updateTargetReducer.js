import {UPDATE_TARGET} from '../constants/action-types.js';

export default (state = null, action) => {
    switch (action.type) {
    case UPDATE_TARGET:
        return action.payload.targetId;
    default:
        return state;
    }
}
