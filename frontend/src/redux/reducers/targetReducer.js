import chai from '../../util/chai-util.js';
const assert = chai.assert;
import {UNSET_TARGET
        , GET_TREE_INFO_IN_PROGRESS
        , GET_FEAT_NUM_PHOTOS_IN_PROGRESS
        , GET_FEAT_PHOTO_IN_PROGRESS        

        , GET_FEATURE_AJAX_CONCLUDED 

        , GET_TREE_INFO_SUCCESS
        , GET_FEAT_NUM_PHOTOS_SUCCESS
        , GET_FEAT_PHOTO_SUCCESS
        
        , SET_TREE_INFO_CURRENT
        , SET_TREE_INFO_ORIGINAL

        , SET_TREE_COORDS
        , REVERT_TREE_INFO
        , REVERT_TREE_COORDS

        , GET_NUM_PHOTOS_IN_PROGRESS
        , NEW_TARGET}  from '../actions/action-types.ts';



/* TODO: rethink the assumption that at any point in time there is single axios cancellable
 *       for every target, be it for tree data or photos
 */


function initState(id) {
    return {id, treeInfo: null, photos: null, axiosSource: null};
}
export default (state = initState(null), action) => {
    switch (action.type) {
    case UNSET_TARGET: {
        return {id: null, treeInfo: null, photos: null};
    }
    case NEW_TARGET: {
        return initState(action.payload.targetId);
    }
    case GET_TREE_INFO_IN_PROGRESS: {
        return Object.assign({}
                             , state
                             , {id: action.payload.id
                                , treeInfo: {original: null
                                             , current: null}
                                , axiosSource: action.payload.axiosSource});
    }

    case GET_FEAT_NUM_PHOTOS_IN_PROGRESS: {
        return Object.assign({}
                             , state
                             , {id: action.payload.id
                                , photos: {num: undefined
                                           , idx: undefined
                                           , img: undefined // image Base64 encoded
                                           , t: undefined}  // time when image was taken in SSE
                                , axiosSource: action.payload.axiosSource});
    }
    case GET_FEAT_PHOTO_IN_PROGRESS: {
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
    case GET_FEATURE_AJAX_CONCLUDED: {
        return Object.assign({}
                             , state
                             , {axiosSource: null});

    }
    case GET_TREE_INFO_SUCCESS: {
        assert.strictEqual(state.id, action.payload.id);
        const original = JSON.parse(JSON.stringify(action.payload));
        const current  = JSON.parse(JSON.stringify(action.payload));
        return Object.assign({}
                             , state
                             , {treeInfo: {original, current}});
    }
    case GET_FEAT_NUM_PHOTOS_SUCCESS: {
        const num = action.payload;
        const idx =  (num>0)?0:null;
        const img = (idx === null)?null:undefined;
        const t   = (idx === null)?null:undefined;
        const photos = {num, idx, img, t};
        return Object.assign({}
                             , state
                             , {photos});
    }
    case GET_FEAT_PHOTO_SUCCESS: {
        const {img, t} = action.payload;
        return Object.assign({}
                             , state
                             , {photos: Object.assign({}
                                                      , state.photos
                                                      , {img, t})});

    }                        
        
    case SET_TREE_INFO_CURRENT: {
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current: JSON.parse(JSON.stringify(action.payload))})});
    }
    case SET_TREE_INFO_ORIGINAL: {
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {original: JSON.parse(JSON.stringify(action.payload))})});
    }        
    case SET_TREE_COORDS: {
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current: Object.assign({}
                                                                                  , state.treeInfo.current
                                                                                  , {coords: action.payload})})});
    }
    case REVERT_TREE_INFO: {
        const current = JSON.parse(JSON.stringify(state.treeInfo.original));
        return Object.assign({}
                             , state
                             , {treeInfo: Object.assign({}
                                                        , state.treeInfo
                                                        , {current})});
    }
    case REVERT_TREE_COORDS: {
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

