import {ActionTypeKeys} from '../actions/action-type-keys.ts';

import chai from '../../util/chai-util.js';
const assert = chai.assert;


export default (state = undefined, action) => {
    switch (action.type) {
    case ActionTypeKeys.GET_REGIONS_IN_PROGRESS: {
        return undefined;
    }
    case ActionTypeKeys.GET_REGIONS_SUCCESS: {
        return action.payload;
    }
    default:
        return state;
    }
}

