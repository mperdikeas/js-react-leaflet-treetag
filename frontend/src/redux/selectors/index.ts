import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {arr2str, reduxRegionsToAntdData} from './selector-util.js';

import {Region} from '../../backend.d.ts';

import {RootState} from '../types.ts';

import {sca_fake_return, isNotNullOrUndefined} from '../../util/util.js';

import {InformationPanelPane} from '../../information-panel-tree.tsx';
import {PartitionsForInstallation} from '../../backend.d.ts';
import {RGE_MODE}   from '../constants/region-editing-mode.ts';


import {Key_Name_WKT} from '../../region-mgmnt-map.tsx';

export function selectedRegions(state: RootState): Key_Name_WKT[] {
    if (isRegionsBeingFetched(state))
        return [];

    const existingRegions: PartitionsForInstallation = state.regions!.existing!;
    const selected: string[] = state.regions!.editing.selected;
    assert.isOk(existingRegions);
    assert.isOk(selected);

    function str2arr(s: string) {
        const rv = s.split('-').map( x=>parseInt(x) );
        return rv;
    }

    function embellish(i: number, polygonsInPartition: {[name:string]: Region}) {
        const rv = [];
        let j = 0;
        for (const [key, value] of Object.entries(polygonsInPartition)) {
            assert.strictEqual(key, value.name);
            const x = Object.assign({}, {name: key, wkt: value.wkt}, {key: arr2str([i, j])});
            rv.push(x);
            j++;
        }
        return rv;
    }


    let rv: Key_Name_WKT[] = [];
    selected.forEach( strKey => {
        const arr = str2arr(strKey);
        assert.isTrue((arr.length===1) || (arr.length===2)
                      , `selectors/index.js :: arr ${arr} had length ${arr.length}`);
        switch (arr.length) {
        case 1: {
            const key = Object.keys(existingRegions)[arr[0]]; //fetched the key at index arr[0]
            console.log(`case 1 partition name is ${key}`);
            rv = rv.concat(embellish(arr[0], existingRegions[key]));  // fetching all the polygons in that partition
            break;
        }
        case 2: {
            const key = Object.keys(existingRegions)[arr[0]]; //fetched the key at index arr[0]
            console.log(`case 2 partition name is ${key}`);
            const partition = existingRegions[key];
            const key2 = Object.keys(partition)[arr[1]]; // fetch the key at index arr[1]
            const wkt = partition[key2].wkt;
            const x = {name: key2, wkt, key: strKey} ;
            console.log('zzz ', x);
            console.log(`zzz pushing object: ${JSON.stringify(x)}`);
            rv.push( x );
            break;
        }
        default:
            assert.fail('selectors/index.js :: impossible');
        }
    });

    return rv;
}


export function existingRegionsAsAntdTreeControlData(state: RootState) {
    assert.isDefined(state.regions!.existing);
    return reduxRegionsToAntdData(state.regions!.existing);
}


// TODO: rename that to isRegionsUninitializedOrRefreshed
// sse-1592816552
export function isRegionsBeingFetched(state: RootState) {
    return (state.regions!.existing===undefined);
}

export function rgeMode(state: RootState): RGE_MODE { // region editing mode
    return state.regions!.editing.mode;
}

// returns an array of partition names
export function partitions(state: RootState): string[] | undefined {
    if (isRegionsBeingFetched(state))
        return undefined;
    else
        return Object.keys(state.regions!.existing!);
}

export function partition2regions(state: RootState): {[index: string]: string} {
    const rv: {[index: string]:any} = {};
    for (const [key, value] of Object.entries(state.regions!.existing!)) {
        rv[key] = Object.keys(value);
    }
    return rv;
}

export function wktRegionUnderConstruction(state: RootState) {
    return state.regions!.editing.regionUnderCreation?.wkt ?? null;
}

export function wktRegionUnderConstructionExists(state: RootState) {
    return (wktRegionUnderConstruction(state) !== null);
}

export function rgmgmntDuringDeletion(state: RootState) {
    return state.regions.editing.duringDeletion;
}

export function rgmgmntDuringModification(state: RootState) {
    return state.regions.editing.duringModification;
}

export function rgmgmntSaveEnabled(state: RootState) {
    return (wktRegionUnderConstructionExists(state) && (!rgmgmntDuringDeletion(state)) && (!rgmgmntDuringModification(state)));
}





export function targetIsDirty(state: RootState) {
    if (state.target.treeInfo != null)
        return JSON.stringify(state.target.treeInfo.original)!==JSON.stringify(state.target.treeInfo.current);
    else
        return false;
}

export function targetInitialAjaxReadInProgress(state: RootState): boolean {
    assert.isOk(state.paneToOpenInfoPanel, 'SNAFU 1 in targetAjaxReadInProgress');
    switch (state.paneToOpenInfoPanel) {
    case InformationPanelPane.INFORMATION:
    case InformationPanelPane.HISTORY:
    case InformationPanelPane.ADJUST:
        return (state.target.id != null) && ((state.target.treeInfo === null) || (state.target.treeInfo.original === null));
    case InformationPanelPane.PHOTOS:
        return (state.target.id != null) && ((state.target.photos == null) || (state.target.photos.img === undefined));
    default:
        assert.fail(`SNAFU 2 in targetAjaxReadInProgress ~ unhandled case: [${state.paneToOpenInfoPanel}]`);
        return sca_fake_return() as unknown as boolean;
    }
}

export function typeOfTargetInitialAjaxReadInProgress(state: RootState): string {
    assert.isOk(state.paneToOpenInfoPanel, 'SNAFU 1 in typeOfTargetAjaxReadInProgress');
    assert.isTrue(isNotNullOrUndefined(state.target.id), 'SNAFU 2 in typeOfTargetAjaxReadInProgress');
    switch (state.paneToOpenInfoPanel) {
    case InformationPanelPane.INFORMATION:
    case InformationPanelPane.HISTORY:
    case InformationPanelPane.ADJUST:
        return 'feat-data-retrieval';
    case InformationPanelPane.PHOTOS:
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


