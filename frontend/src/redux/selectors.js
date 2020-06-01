
export function modalLoginInProgress(state) {
    const rv = {
        toasts               : toastReducer                (state.toasts, action),
        latlng               : mouseCoordsReducer          (state.latlng, action),
        targetId             : toggleTargetReducer         (state.targetId, action),
        modals               : modalReducer                (state.modals, action),
        maximizedInfoPanel   : maximizedInfoPanelReducer   (state.maximizedInfoPanel, action),
        paneToOpenInfoPanel  : paneToOpenInfoPanelReducer  (state.paneToOpenInfoPanel, action),
        treeInfo             : treeInfoReducer             (state.treeInfo, action)
    };
    return rv;
};


export default rootReducer;
