import {MARK_GET_FEATURE_INFO_IN_PROGRESS
        , MARK_GET_FEATURE_INFO_FAILED
        , SET_TREE_INFO_ORIGINAL
        , SET_TREE_INFO
        , SET_TREE_COORDS
        , REVERT_TREE_INFO
        , REVERT_TREE_COORDS}  from '../actions/action-types.js';


export default (state = {original: null
                         , current: null
                         , fetchInProgress: false
                         , axiosSource: null
                         , fetchFailed: false}, action) => {
                             switch (action.type) {
                             case MARK_GET_FEATURE_INFO_IN_PROGRESS: {
                                 return Object.assign({}, state, {fetchInProgress: true, axiosSource: action.payload.cancelToken});
                             }
                             case MARK_GET_FEATURE_INFO_FAILED: {
                                 return Object.assign({}, state, {fetchInProgress: false, axiosSource: null});
                             }
                                 case SET_TREE_INFO_ORIGINAL: {
                                     const original = JSON.parse(JSON.stringify(action.payload));
                                     const current  = JSON.parse(JSON.stringify(action.payload));
                                     return {original, current, fetchInProgress: false, axiosSource: null};
                                 }
                                 case SET_TREE_INFO: {
                                     return Object.assign({}, state, {current: JSON.parse(JSON.stringify(action.payload))});
                                 }
                                 case SET_TREE_COORDS: {
                                     const currentDeepCopy = (state.current)==={}?{}:JSON.parse(JSON.stringify(state.current));
                                     const newCurrent = Object.assign(currentDeepCopy, {coords: JSON.parse(JSON.stringify(action.payload))});
                                     return Object.assign({}, state, {current: newCurrent});
                                 }
                                 case REVERT_TREE_INFO: {
                                     const current = JSON.parse(JSON.stringify(state.original));
                                     return Object.assign({}, state, {current});
                                 }
                                 case REVERT_TREE_COORDS: {
                                     const currentDeepCopy = JSON.parse(JSON.stringify(state.current));
                                     const newCurrent = Object.assign(currentDeepCopy, {coords: JSON.parse(JSON.stringify(state.original.coords))});
                                     return Object.assign({}, state, {current: newCurrent});
                                 }
                                 default:
                                 return state;
                             }
                             }
