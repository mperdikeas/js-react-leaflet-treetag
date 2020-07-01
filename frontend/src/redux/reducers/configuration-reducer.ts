import {ActionTypeKeys} from '../actions/action-type-keys.ts';
import {Action} from '../actions/action-types.ts';

export default (state = undefined, action: Action) => {
    switch (action.type) {
    case ActionTypeKeys.UPDATE_CONFIGURATION:
        return action.payload;
    default:
        return state;
    }
}
