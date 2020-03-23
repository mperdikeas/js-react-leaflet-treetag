import {TOGGLE_MAXIMIZE_INFO_PANEL} from '../constants/action-types.js';

export default (state = false, action) => {
    switch (action.type) {
    case TOGGLE_MAXIMIZE_INFO_PANEL:
        return !state;
    default:
        return state;
    }
}
