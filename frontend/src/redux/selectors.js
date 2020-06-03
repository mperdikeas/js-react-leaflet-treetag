const assert = require('chai').assert;

import {sca_fake_return, isNotNullOrUndefined} from '../util/util.js';




import {INFORMATION
        , PHOTOS
        , HISTORY
        , ADJUST} from '../constants/information-panel-panes.js';


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

export function targetInitialAjaxReadInProgress(state) {
    assert.isOk(state.paneToOpenInfoPanel, 'SNAFU 1 in targetAjaxReadInProgress');
    switch (state.paneToOpenInfoPanel) {
    case INFORMATION:
    case HISTORY:
    case ADJUST:
        console.log('abd - sel1');
        const v = (state.target.id != null) && (state.target.treeInfo.original === null);
        console.log(`abd - sel1 ${v}`);
        return v;
    case PHOTOS:
        console.log('abd - sel2');
        const v2 = (state.target.id != null) && (state.target.photos.img === undefined);
        console.log(`abd - sel2 ${v2}`);
        return v2;
    default:
        assert.fail(`SNAFU 2 in targetAjaxReadInProgress ~ unhandled case: [${state.paneToOpenInfoPanel}]`);
        return sca_fake_return();
    }
}

export function typeOfTargetInitialAjaxReadInProgress(state) {
    assert.isOk(state.paneToOpenInfoPanel, 'SNAFU 1 in typeOfTargetAjaxReadInProgress');
    assert.isTrue(isNotNullOrUndefined(state.target.id), 'SNAFU 2 in typeOfTargetAjaxReadInProgress');
    switch (state.paneToOpenInfoPanel) {
    case INFORMATION:
    case HISTORY:
    case ADJUST:
        return 'feat-data-retrieval';
    case PHOTOS:
        if (state.target.photos.num === undefined)
            return 'feat-num-photos-retrieval';
        else
            return 'feat-photo-retrieval';
    default:
        assert.fail(`SNAFU 2 in typeOfTargetAjaxReadInProgress ~ unhandled case: [${state.paneToOpenInfoPanel}]`);
        return sca_fake_return();
    }
}

export function fetchingNewPhotoForExistingTarget(state) {
    assert.isOk(state.paneToOpenInfoPanel, 'SNAFU 1 in fetchingNewPhotoForExistingTarget');
    assert.strictEqual(state.paneToOpenInfoPanel, PHOTOS, 'SNAFU 2 in fetchingNewPhotoForExistingTarget');
    assert.isTrue(isNotNullOrUndefined(state.target.photos.num), 'SNAFU 3 in typeOfTargetAjaxReadInProgress');
    assert.isTrue(isNotNullOrUndefined(state.target.photos.idx), 'SNAFU 4 in typeOfTargetAjaxReadInProgress');
    assert.isDefined(state.target.photos.img, 'SNAFU 5 in typeOfTargetAjaxReadInProgress');
    assert.isDefined(state.target.photos.t, 'SNAFU 6 in typeOfTargetAjaxReadInProgress');
    if ((state.target.photos.t == null) || (state.target.photos.img == null)) {
        assert.isTrue(state.target.photos.t === state.target.photos.img);
    }
    return state.target.photos.img === null;
}


export function cancelToken(state) {
    if (state.target)
        return state.target.axiosSource;
    else
        return null;
}


