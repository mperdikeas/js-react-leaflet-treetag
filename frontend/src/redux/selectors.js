
export function treeInfoIsBeingUpdated(state) {
    if (state.targetId===null) {
        return false;
    } else {
        if (state.treeInfo.original===null) {
            return true;
        } else {
            return (state.targetId !== state.treeInfo.original.id);
        }
    }
};


