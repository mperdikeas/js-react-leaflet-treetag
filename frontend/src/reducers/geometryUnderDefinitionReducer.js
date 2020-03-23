import { v4 as uuidv4 } from 'uuid';

import {ADD_POINT_TO_POLYGON_UNDER_CONSTRUCTION, TOGGLE_MODE, ADD_GEOMETRY} from '../constants/action-types.js';

import {DEFINE_POLYGON} from '../constants/modes.js';

import {allStrictEqual} from '../util.js';

function newGeometryUnderConstruction() {
    return {polygonId: uuidv4(), points: []};
}

export default (state = newGeometryUnderConstruction(), actionAndState) => {
    const {action, state: actionAdditionalState} = actionAndState;
    switch (action.type) {
    case ADD_POINT_TO_POLYGON_UNDER_CONSTRUCTION:
        return Object.assign({}
                             , state
                             , {points: [...state.points, action.payload.latlng]});
    case TOGGLE_MODE:
        if (allStrictEqual([actionAdditionalState.mode, action.payload.mode, DEFINE_POLYGON])) {
            return newGeometryUnderConstruction();
        }
    case ADD_GEOMETRY:
        return newGeometryUnderConstruction();
    default:
        return state;
    }
}
