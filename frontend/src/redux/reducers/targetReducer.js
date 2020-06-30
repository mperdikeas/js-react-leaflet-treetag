import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {ActionTypeKeys} from '../actions/action-type-keys.ts';

/* TODO: rethink the assumption that at any point in time there is single axios cancellable
 *       for every target, be it for tree data or photos
 */


function initState(id) {
    return {id, treeInfo: null, photos: null, axiosSource: null};
}
export default (state = initState(null), action) => {
    switch (action.type) {
    case ActionTypeKeys.UNSET_TARGET: {
        return {id: null, treeInfo: null, photos: null};
    }
    case ActionTypeKeys.NEW_TARGET: {
        return initState(action.payload.targetId);
    }
    case ActionTypeKeys.GET_TREE_INFO_IN_PROGRESS: {
        return Object.assign({}
                             , state
                             , {id: action.payload.id
                                , treeInfo: {original: null
                                             , current: null}
                                , axiosSource: action.payload.axiosSource});
    }

    case ActionTypeKeys.GET_FEAT_NUM_PHOTOS_IN_PROGRESS: {
        return Object.assign({}
                             , state
                             , {id: action.payload.id
                                , photos: {num: undefined
                                           , idx: undefined
                                           , img: undefined // image Base64 encoded
                                           , t: undefined}  // time when image was taken in SSE
                                , axiosSource: action.payload.axiosSource});
    }
    case ActionTypeKeys.GET_FEAT_PHOTO_IN_PROGRESS: {
        const img = (state.photos.img === undefined)?undefined:null; // mighty deep
        const t = img;
        return Object.assign({}
                             , state
                             , {id: action.payload.id
                                , photos: Object.assign({}
                                                        , state.photos
                                                        , {idx: action.payload.idx, img, t})
                                , axiosSource: action.payload.axiosSource});
    }
    case ActionTypeKeys.GET_FEATURE_AJAX_CONCLUDED: {
        return Object.assign({}
                             , state
                             , {axiosSource: null});

    }
    case ActionTypeKeys.GET_TREE_INFO_SUCCESS: {
        assert.strictEqual(state.id, action.payload.id);
        const original = JSON.parse(JSON.stringify(action.payload));
        const current  = JSON.parse(JSON.stringify(action.payload));
        return Object.assign({}
                             , state
                             , {treeInfo: {original, current}});
    }
    case ActionTypeKeys.GET_FEAT_NUM_PHOTOS_SUCCESS: {
        const num = action.payload;
        const idx =  (num>0)?0:null;
        const img = (idx === null)?null:undefined;
        const t   = (idx === null)?null:undefined;
        const photos = {num, idx, img, t};
        return Object.assign({}
                             , state
                             , {photos});
    }
    case ActionTypeKeys.GET_FEAT_PHOTO_SUCCESS: {
        const {img, t} = action.payload;
        return Object.assign({}
                             , state
                             , {photos: Object.assign({}
                                                      , state.photos
                                                      , {img, t})});

    }                        
        
    case ActionTypeKeys.SET_TREE_INFO_CURRENT: {
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current: JSON.parse(JSON.stringify(action.payload))})});
    }
    case ActionTypeKeys.SET_TREE_INFO_ORIGINAL: {
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {original: JSON.parse(JSON.stringify(action.payload))})});
    }        
    case ActionTypeKeys.SET_TREE_COORDS: {
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current: Object.assign({}
                                                                                  , state.treeInfo.current
                                                                                  , {coords: action.payload})})});
    }
    case ActionTypeKeys.REVERT_TREE_INFO: {
        const current = JSON.parse(JSON.stringify(state.treeInfo.original));
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current})});
    }
    case ActionTypeKeys.REVERT_TREE_COORDS: {
//        const currentDeepCopy = JSON.parse(JSON.stringify(state.treeInfo.current));
  //      const newCurrent = Object.assign(currentDeepCopy, {coords: JSON.parse(JSON.stringify(state.treeInfo.original.coords))});
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current: Object.assign({}
                                                                                  , state.treeInfo.current
                                                                                  , {coords: JSON.parse(JSON.stringify(state.treeInfo.original.coords))})})});
    }

    default:
        return state;
    }
}

