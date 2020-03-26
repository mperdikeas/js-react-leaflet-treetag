import {SET_FLAG, CLEAR_FLAG} from '../constants/action-types.js';

const initialState = {
    CLEAR_DRAW_WORKSPACE: false
};

export default (state = initialState, action) => {
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
    default: {
        return state;
    }
    } // switch
}
