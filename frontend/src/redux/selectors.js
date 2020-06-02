const assert = require('chai').assert;

export function treeInfoNotFetchedYetOrIsBeingUpdated(state) {
    assert.exists(state.targetId, 'treeInfoNotFetchedYetOrIsBeingUpdated selector - inconceivable that targetId is null or undefined');
/*    if (state.targetId===null) {
        return false;
        } else {*/
    return (state.treeInfo.original===null)

    /*
        if (state.treeInfo.original===null) {
            return true;
        } else {
            return (state.targetId !== state.treeInfo.original.id);
        }*/
//    }
};

export function targetIsDirty(state) {
    if (state.target.treeInfo != null)
        return JSON.stringify(state.target.treeInfo.original)!==JSON.stringify(state.target.treeInfo.current);
    else
        return false;
}

export function targetAjaxReadInProgress(state) {
    return (state.target.id != null) && (state.target.treeInfo.original === null);
}

export function cancelToken(state) {
    if (state.target && state.target.treeInfo)
        return state.target.treeInfo.axiosSource;
    else
        return null;
}


