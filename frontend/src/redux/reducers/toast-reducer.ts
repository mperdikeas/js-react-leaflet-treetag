import chai from '../../util/chai-util.js'
const assert = chai.assert;


import {ActionTypeKeys} from '../actions/action-type-keys.ts';
import {Action}         from '../actions/action-types.ts';


export type Toast = {
    readonly header: string,
    readonly msg: string
}

export type ToastsReducerState = Record<number, Toast>


export default (toasts: ToastsReducerState = {}, action: Action): ToastsReducerState => {
    switch (action.type) {
    case ActionTypeKeys.ADD_TOAST: {
        const currentMaxKey = Math.max(-1, ...Object.keys(toasts).map(x=>parseInt(x)));
        const {header, msg} = action.payload;
        assert.isOk(header);
        assert.isOk(msg);
        return Object.assign({}, toasts, {[currentMaxKey+1]: {header, msg}});
    }
    case ActionTypeKeys.DISMISS_TOAST: {
        const {id}: {id: number} = action.payload;
        const toasts2 = {...toasts};
        delete toasts2[id];
        return toasts2;
    }
    default: {
        return toasts;
    }
    }
}

