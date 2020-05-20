import {SET_TREE_INFO_ORIGINAL
        , SET_TREE_INFO
        , SET_TREE_COORDS
        , REVERT_TREE_INFO
        , REVERT_TREE_COORDS}  from '../constants/action-types.js';


export default (state = {original: null, current: null}, action) => {
    switch (action.type) {
    case SET_TREE_INFO_ORIGINAL: {
        const original = JSON.parse(JSON.stringify(action.payload));
        const current  = JSON.parse(JSON.stringify(action.payload));
        return {original, current};
    }
    case SET_TREE_INFO: {
        return Object.assign(state, {current: JSON.parse(JSON.stringify(action.payload))});
    }
    case SET_TREE_COORDS: {
        const currentDeepCopy = (state.current)==={}?{}:JSON.parse(JSON.stringify(state.current));
        const newCurrent = Object.assign(currentDeepCopy, {coords: JSON.parse(JSON.stringify(action.payload))});
        return Object.assign(state, {current: newCurrent});
    }
    case REVERT_TREE_INFO: {
        const current = JSON.parse(JSON.stringify(state.original));
        return Object.assign(state, {current});
    }
    case REVERT_TREE_COORDS: {
        const currentDeepCopy = JSON.parse(JSON.stringify(state.current));
        const newCurrent = Object.assign(currentDeepCopy, {coords: JSON.parse(JSON.stringify(state.original.coords))});
        return Object.assign(state, {current: newCurrent});
    }
    default:
        return state;
    }
}
