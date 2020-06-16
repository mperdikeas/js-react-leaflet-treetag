import {SET_RGE_MODE}  from '../actions/action-types.js';


import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {RGE_MODE, ensureRGEModeIsValid} from '../constants/region-editing-mode.js';

export default (state = {mode: RGE_MODE.UNENGAGED}, action) => {
    switch (action.type) {
    case SET_RGE_MODE:
        const mode = action.payload;
        ensureRGEModeIsValid(mode);
        console.log(`XXX editing reducer setting mode to ${mode}`);
        return {mode};
    default:
        return state;
    }
}

