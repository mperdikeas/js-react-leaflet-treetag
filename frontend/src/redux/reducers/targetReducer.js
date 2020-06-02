import {UNSET_TARGET
        , GET_TREE_INFO_IN_PROGRESS
        , GET_TREE_INFO_CONCLUDED 
        , GET_TREE_INFO_SUCCESS
        
        , SET_TREE_INFO_CURRENT
        , SET_TREE_INFO_ORIGINAL

        , SET_TREE_COORDS
        , REVERT_TREE_INFO
        , REVERT_TREE_COORDS}  from '../actions/action-types.js';



const assert = require('chai').assert;

export default (state = {id: null, treeInfo: null}, action) => {
    switch (action.type) {
    case UNSET_TARGET: {
        return {id: null, treeInfo: null, photos: null};
    }
    case GET_TREE_INFO_IN_PROGRESS: {
        return Object.assign({}
                             , state
                             , {id: action.payload.id
                                , treeInfo: {original: null
                                             , current: null
                                             , axiosSource: action.payload.axiosSource}});
    }
    case GET_TREE_INFO_CONCLUDED: {
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {axiosSource: null})});

    }
    case GET_TREE_INFO_SUCCESS: {
        assert.strictEqual(state.id, action.payload.id);
        const original = JSON.parse(JSON.stringify(action.payload));
        const current  = JSON.parse(JSON.stringify(action.payload));
        const rv = Object.assign({}
                             , state
                                 , {treeInfo: {original, current, axiosSource: null}});
        console.log(rv);
        return rv;

    }
    case SET_TREE_INFO_CURRENT: {
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current: JSON.parse(JSON.stringify(action.payload))})});
    }
    case SET_TREE_COORDS: {
        const currentDeepCopy = (state.treeInfo.current)==={}?{}:JSON.parse(JSON.stringify(state.treeInfo.current));
        const newCurrent = Object.assign(currentDeepCopy, {coords: JSON.parse(JSON.stringify(action.payload))});
        return Object.assign({}
                             , state
                             , {treeInfo: {current: newCurrent}});
    }
    case REVERT_TREE_INFO: {
        console.log(state.treeInfo.current);
        console.log(state.treeInfo.original);
        const current = JSON.parse(JSON.stringify(state.treeInfo.original));
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current})});
    }
    case REVERT_TREE_COORDS: {
        const currentDeepCopy = JSON.parse(JSON.stringify(state.treeInfo.current));
        const newCurrent = Object.assign(currentDeepCopy, {coords: JSON.parse(JSON.stringify(state.treeInfo.original.coords))});
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current: newCurrent})});
    }
    default:
        return state;
    }
}

