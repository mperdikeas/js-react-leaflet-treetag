const assert = require('chai').assert;

import {ADD_TOAST, DISMISS_TOAST} from '../actions/action-types.ts';



export default (toasts = {}, action) => {
    switch (action.type) {
    case ADD_TOAST: {
        const currentMaxKey = Math.max(-1, ...Object.keys(toasts).map(x=>parseInt(x)));
        const {header, msg} = action.payload;
        assert.isOk(header);
        assert.isOk(msg);
        return Object.assign({}, toasts, {[currentMaxKey+1]: {header, msg}});
    }
    case DISMISS_TOAST: {
        const {id} = action.payload;
        const toasts2 = {...toasts};
        delete toasts2[id];
        return toasts2;
    }
    default: {
        return toasts;
    }
    }
}
