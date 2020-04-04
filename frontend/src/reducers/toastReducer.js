const assert = require('chai').assert;

import {ADD_TOAST} from '../constants/action-types.js';


export default (toasts = [{id: 1, msg: 'foo'}], action) => {
    switch (action.type) {
    case ADD_TOAST: {
        const {id, msg} = action.payload;
        const toasts2 = [...toasts];
        toasts2.push({id, msg});
        return toasts2;
    }
    default: {
        return toasts;
    }
    }
}
