import {CLEAR_FLAG, TOGGLE_MODE} from '../constants/action-types.js';
import {allStrictEqual} from '../util.js';
import {DEFINE_POLYGON} from '../constants/modes.js';


export default (state = {DELETE_GEOMETRY_UNDER_DEFINITION: false}, actionAndState) => {
    const {action, state: actionAdditionalState} = actionAndState;
    switch (action.type) {
    case CLEAR_FLAG:
        const flags = {...state};
        console.log(flags);
        flags[action.payload.flagToClear] = false;
        return flags;
    case TOGGLE_MODE:
        if ((allStrictEqual([actionAdditionalState.mode, action.payload.mode, DEFINE_POLYGON]))
            &&
            (actionAdditionalState.geometryUnderDefinitionExists)) {
            const flags = {...state};
            flags.DELETE_GEOMETRY_UNDER_DEFINITION = true;
            return flags;
        }
    default:
        return state;
    }
}
