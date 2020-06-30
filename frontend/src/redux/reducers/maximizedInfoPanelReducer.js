import {TOGGLE_MAXIMIZE_INFO_PANEL} from '../actions/action-type-keys.ts';

export default (state = false, action) => {
    switch (action.type) {
    case TOGGLE_MAXIMIZE_INFO_PANEL:
        return !state;
    default:
        return state;
    }
}
