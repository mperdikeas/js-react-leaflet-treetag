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


