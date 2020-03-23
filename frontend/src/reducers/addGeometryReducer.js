import {ADD_GEOMETRY} from '../constants/action-types.js';

export default (state = [], action) => {
    switch (action.type) {
    case ADD_GEOMETRY:
        return [...state, {geometryName: action.payload.geometryName
                           , points: action.payload.points}];
    default:
        return state;
    }
}
