import {ActionTypeKeys} from '../actions/action-type-keys.ts';

export default (state = false, action) => {
    switch (action.type) {
    case ActionTypeKeys.TOGGLE_MAXIMIZE_INFO_PANEL:
        return !state;
    default:
        return state;
    }
}
