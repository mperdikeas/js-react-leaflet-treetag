import {ActionTypeKeys} from '../actions/action-type-keys.ts';

export default (state = undefined, action) => {
    switch (action.type) {
    case ActionTypeKeys.UPDATE_TREES:
        return action.payload;
    default:
        return state;
    }
}
