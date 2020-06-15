import {SET_RGE_MODE}  from '../actions/action-types.js';


import chai from '../../util/chai-util.js';
const assert = chai.assert;

// ReGion Editing mode
export const RGE_MODE = {UNENGAGED: 'unengaged', CREATING: 'creating', MODIFYING: 'modifying'};
export function ensureRGEModeIsValid(mode) {
    assert.isTrue([RGE_MODE.UNENGAGED, RGE_MODE.CREATING, RGE_MODE.MODIFYING].includes(mode)
                  , `unrecognized mode: '${mode}'`);
}

export default (state = {mode: RGE_MODE.UNENGAGED}, action) => {
    switch (action.type) {
    case SET_RGE_MODE:
        return {mode: action.payload};
    default:
        return state;
    }
}

