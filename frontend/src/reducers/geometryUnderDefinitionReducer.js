import {ADD_POINT_TO_POLYGON_UNDER_CONSTRUCTION, TOGGLE_MODE, ADD_GEOMETRY} from '../constants/action-types.js';

import {DEFINE_POLYGON} from '../constants/modes.js';

import {allStrictEqual} from '../util.js';

export default (state = [], actionAndState) => {
    const {action, state: actionAdditionalState} = actionAndState;
    switch (action.type) {
    case ADD_POINT_TO_POLYGON_UNDER_CONSTRUCTION:
        return [...state, action.payload.latlng];
    case TOGGLE_MODE:
        if (allStrictEqual([actionAdditionalState.mode, action.payload.mode, DEFINE_POLYGON])) {
            return [];
        }
    case ADD_GEOMETRY:
        return [];
    default:
        return state;
    }
}
