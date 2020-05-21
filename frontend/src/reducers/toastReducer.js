const assert = require('chai').assert;

import {ADD_TOAST, DISMISS_TOAST} from '../constants/action-types.js';
import {sca_fake_return} from '../util.js';


function findIndexOfToast(toasts, id) {
    for (let i = 0 ; i < toasts.length ; i++) {
        if (toasts[i].id===id)
            return i;
    }
    assert.fail(`unable to find toast with id=[${id}]`);
    return sca_fake_return();
}

export default (toasts = {}, action) => {
    switch (action.type) {
    case ADD_TOAST: {
        const currentMaxKey = Math.max(-1, ...Object.keys(toasts).map(x=>parseInt(x)));
        const {header, msg} = action.payload;
        return Object.assign({}, toasts, {[currentMaxKey+1]: action.payload});
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
