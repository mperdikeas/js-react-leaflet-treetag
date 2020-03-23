import {ADD_GEOMETRY} from '../constants/action-types.js';

export default (state = [], action) => {
    switch (action.type) {
    case ADD_GEOMETRY:
        return [...state, {polygonId: action.payload.polygonId
                           , geometryName: action.payload.geometryName
                           , polygon: action.payload.polygon}];
    default:
        return state;
    }
}
