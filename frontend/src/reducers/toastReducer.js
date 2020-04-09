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
        const {header, msg} = action.payload;
        const toasts2 = {...toasts};
        const currentMaxKey = Math.max(-1, ...Object.keys(toasts2).map(x=>parseInt(x)));
        toasts2[currentMaxKey+1]={header, msg};
        return toasts2;
    }
    case DISMISS_TOAST: {
        console.log(`type: ${action.type}, id: ${action.payload.id}`);
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
