import chai from '../../util/chai-util.js';
const assert = chai.assert;


import {ActionTypeKeys} from '../actions/action-type-keys.ts';
import {Action} from '../actions/action-types.ts';

import {sca_fake_return} from '../../util/util.js';

import {RGE_MODE} from '../constants/region-editing-mode.ts';

import {Region} from '../../backend.d.ts';

export type EditingRegionsReducerState = {mode: RGE_MODE
                                          , selected: string[]
                                          , regionUnderCreation: Region | null
                                          , duringDeletion: boolean
                                          , duringModification: boolean};

export default (state: EditingRegionsReducerState | undefined = {mode: RGE_MODE.UNENGAGED
                         , selected: []
                         , regionUnderCreation: null
                         , duringDeletion: false
                         , duringModification: false}, action: Action) => {
                             switch (action.type) {
                             case ActionTypeKeys.UPDATE_SELECTED_REGIONS:
                                 return Object.assign({}, state, {selected: action.payload});
                             case ActionTypeKeys.SET_RGE_MODE:
                                 const {mode} = action.payload;
                                 const regionUnderCreation = (()=>{
                                     switch (mode) {
                                     case RGE_MODE.CREATING:
                                         return {wkt: null};
                                     case RGE_MODE.UNENGAGED:
                                     case RGE_MODE.MODIFYING:
                                         return null;
                                     default:
                                         assert.fail(`editing-regions-reducer.ts ~*~ unhandled mode: ${mode}`);
                                         return sca_fake_return();
                                     }})();
                                 return Object.assign({}, state, {mode}, {regionUnderCreation});
                             case ActionTypeKeys.SET_WKT_REGION_UNDER_CONSTRUCTION:
                                 assert.strictEqual(state.mode, RGE_MODE.CREATING, `editing-regions-reducer.ts :: mode is ${state.mode}`);
                                 return Object.assign({}, state, {regionUnderCreation: {wkt: action.payload.wkt}});
                             case ActionTypeKeys.REG_MGMNT_DELETE_START:
                                 return Object.assign({}, state, {duringDeletion: true});
                             case ActionTypeKeys.REG_MGMNT_DELETE_END:
                                 return Object.assign({}, state, {duringDeletion: false});
                             case ActionTypeKeys.REG_MGMNT_MODIFY_START:
                                 return Object.assign({}, state, {duringModification: true});
                             case ActionTypeKeys.REG_MGMNT_MODIFY_END:
                                 return Object.assign({}, state, {duringModification: false});
                             default:
                                 return state;
                             }
                         }
