import {SET_FLAG, CLEAR_FLAG, TOGGLE_MODE} from '../constants/action-types.js';
import {allStrictEqual} from '../util.js';
import {DEFINE_POLYGON} from '../constants/modes.js';

const initialState = {
    DELETE_GEOMETRY_UNDER_DEFINITION: false
    , CLEAR_DRAW_WORKSPACE: false
};

export default (state = initialState, actionAndState) => {
    const {action, state: actionAdditionalState} = actionAndState;
    switch (action.type) {
    case SET_FLAG: {
        const flags = {...state};
        console.log(flags);
        flags[action.payload.flagToSet] = action.payload.flagValue;
        return flags;
    }
    case CLEAR_FLAG: {
        const flags = {...state};
        console.log(flags);
        flags[action.payload.flagToClear] = null;
        return flags;
    }
    case TOGGLE_MODE: {
        if ((allStrictEqual([actionAdditionalState.mode, action.payload.mode, DEFINE_POLYGON]))
            &&
            (actionAdditionalState.geometryUnderDefinitionExists)) {
            const flags = {...state};
            flags.DELETE_GEOMETRY_UNDER_DEFINITION = true;
            return flags;
        }
    }
    default: {
        return state;
    }
    } // switch
}
