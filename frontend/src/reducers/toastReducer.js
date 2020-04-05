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

export default (toasts = [{id: 1, msg: 'foo'}, {id:2, msg: 'boo'}], action) => {
    switch (action.type) {
    case ADD_TOAST: {
        const {id, msg} = action.payload;
        const toasts2 = [...toasts];
        toasts2.push({id, msg});
        return toasts2;
    }
    case DISMISS_TOAST: {
        const {id} = action.payload;
        const idx = findIndexOfToast(toasts, id);
        const toasts2 = [...toasts];
        toasts2.splice(idx);
        return toasts2;
    }
    default: {
        return toasts;
    }
    }
}
