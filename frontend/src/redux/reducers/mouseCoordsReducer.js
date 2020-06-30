import {ActionTypeKeys} from '../actions/action-type-keys.ts';

export default (state = null, action) => {
    switch (action.type) {
    case ActionTypeKeys.UPDATE_MOUSE_COORDS:
        return action.payload.latlng;
    default:
        return state;
    }
}
