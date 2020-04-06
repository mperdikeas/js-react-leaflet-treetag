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

export default (toasts = {1: {msg: 'foo'}, 2: {msg: 'boo'}, 3: {msg: 'koo'}}, action) => {
    switch (action.type) {
    case ADD_TOAST: {
        const {msg} = action.payload;
        const toasts2 = {...toasts};
        const currentMaxKey = Math.max(...Object.keys(m).map(x=>parseInt(x)));
        toasts2[currentMaxKey+1]={msg};
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
