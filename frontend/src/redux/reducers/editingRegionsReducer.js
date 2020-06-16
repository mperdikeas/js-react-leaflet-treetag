import {SET_RGE_MODE}  from '../actions/action-types.js';

import {sca_fake_return} from '../../util/util.js';
import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {RGE_MODE, ensureRGEModeIsValid} from '../constants/region-editing-mode.js';


export default (state = {mode: RGE_MODE.UNENGAGED, regionUnderCreation: null}, action) => {
    switch (action.type) {
    case SET_RGE_MODE:
        const mode = action.payload;
        ensureRGEModeIsValid(mode);
        const regionUnderCreation = (()=>{
        switch (mode) {
        case RGE_MODE.CREATING:
            return {wkt: null};
        case RGE_MODE.UNENGAGED:
        case RGE_MODE.MODIFYING:
            return null;
        default:
            assert.fail(`editingRegionsReducer.js ~*~ unhandled mode: ${mode}`);
            return sca_fake_return();
        }})();
        return Object.assign({}, state, {mode}, {regionUnderCreation});
    default:
        return state;
    }
}

