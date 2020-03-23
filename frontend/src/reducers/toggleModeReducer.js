import {TOGGLE_MODE} from '../constants/action-types.js';
import {SELECT_TREE} from '../constants/modes.js';

export default (state = SELECT_TREE, action) => {
     switch (action.type) {
    case TOGGLE_MODE:
         if (state === action.payload.mode) {
             return null;
        } else {
             return action.payload.mode;
        }
    default:
        return state;
    }
}
