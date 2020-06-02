import {TOGGLE_TARGET} from '../actions/action-types.js';

const assert = require('chai').assert;

export default (state = null, action) => {
    switch (action.type) {
    case TOGGLE_TARGET:
        assert.isNotNull(action.payload.targetId);
        assert.isDefined(action.payload.targetId);
        if ((state===null) || (state!=action.payload.targetId)) {
            return action.payload.targetId;
        } else {
            assert.strictEqual(state, action.payload.targetId);
            return null;
        }
    default:
        return state;
    }
}
