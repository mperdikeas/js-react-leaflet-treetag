const assert = require('chai').assert;

import {RootState} from './types.ts';

import {sca_fake_return, isNotNullOrUndefined} from '../util/util.js';




import {INFORMATION
        , PHOTOS
        , HISTORY
        , ADJUST} from '../constants/information-panel-panes.js';


export function targetIsDirty(state: RootState) {
    if (state.target.treeInfo != null)
        return JSON.stringify(state.target.treeInfo.original)!==JSON.stringify(state.target.treeInfo.current);
    else
        return false;
}

export function targetInitialAjaxReadInProgress(state: RootState): boolean {
    assert.isOk(state.paneToOpenInfoPanel, 'SNAFU 1 in targetAjaxReadInProgress');
    switch (state.paneToOpenInfoPanel) {
    case INFORMATION:
    case HISTORY:
    case ADJUST:
        const v = (state.target.id != null) && ((state.target.treeInfo === null) || (state.target.treeInfo.original === null));
        return v;
    case PHOTOS:
        const v2 = (state.target.id != null) && ((state.target.photos == null) || (state.target.photos.img === undefined));
        return v2;
    default:
        assert.fail(`SNAFU 2 in targetAjaxReadInProgress ~ unhandled case: [${state.paneToOpenInfoPanel}]`);
        return sca_fake_return() as unknown as boolean;
    }
}

export function typeOfTargetInitialAjaxReadInProgress(state: RootState): string {
    assert.isOk(state.paneToOpenInfoPanel, 'SNAFU 1 in typeOfTargetAjaxReadInProgress');
    assert.isTrue(isNotNullOrUndefined(state.target.id), 'SNAFU 2 in typeOfTargetAjaxReadInProgress');
    switch (state.paneToOpenInfoPanel) {
    case INFORMATION:
    case HISTORY:
    case ADJUST:
        return 'feat-data-retrieval';
    case PHOTOS:
        if ((state.target.photos == null) || (state.target.photos.num === undefined))
            return 'feat-num-photos-retrieval';
        else
            return 'feat-photo-retrieval';
    default:
        assert.fail(`SNAFU 2 in typeOfTargetAjaxReadInProgress ~ unhandled case: [${state.paneToOpenInfoPanel}]`);
        return sca_fake_return();
    }
}

export function fetchingNewPhotoForExistingTarget(state: RootState) {
    return state.target!.photos!.img === null;
}


export function cancelToken(state: RootState) {
    if (state.target)
        return state.target.axiosSource;
    else
        return null;
}


