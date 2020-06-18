import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {SET_RGE_MODE
        , SET_WKT_REGION_UNDER_CONSTRUCTION
        , REG_MGMNT_DELETE_START
        , REG_MGMNT_DELETE_END
       }  from '../actions/action-types.js';

import {sca_fake_return} from '../../util/util.js';

import {RGE_MODE, ensureRGEModeIsValid} from '../constants/region-editing-mode.js';


export default (state = {mode: RGE_MODE.UNENGAGED, regionUnderCreation: null, duringDeletion: false}, action) => {
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
    case SET_WKT_REGION_UNDER_CONSTRUCTION:
        assert.strictEqual(state.mode, RGE_MODE.CREATING, `editingRegionsReducer.js :: mode is ${state.mode}`);
        return Object.assign({}, state, {regionUnderCreation: {wkt: action.payload}});
    case REG_MGMNT_DELETE_START:
        return Object.assign({}, state, {duringDeletion: true});
    case REG_MGMNT_DELETE_END:
        return Object.assign({}, state, {duringDeletion: false});
    default:
        return state;
    }
}

