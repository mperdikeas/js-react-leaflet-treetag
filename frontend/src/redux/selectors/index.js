import chai from '../../util/chai-util.js';
const assert = require('chai').assert;

import {reduxRegionsToAntdData} from './selector-util.js';

function arr2str(vs) {
    const rv =  vs.map( x=>x.toString()).join('-');
    return rv;
}


export function selectedRegions(state) {

    const {val, selected} = state.regions.existing;
    assert.isOk(val);
    assert.isOk(selected);

    function str2arr(s) {
        const rv = s.split('-').map( x=>parseInt(x) );
        return rv;
    }

    function embellish(i, polygonsInPartition) {
        const rv = [];
        for (let j = 0; j < polygonsInPartition.length ; j++) {
            rv.push(Object.assign({}, polygonsInPartition[j], {key: arr2str([i, j])}));
        }
        return rv;
    }


    let rv = [];
    selected.forEach( strKey => {
        const arr = str2arr(strKey);
        assert.isTrue((arr.length===1) || (arr.length===2)
                      , `selectors/index.js :: arr ${arr} had length ${arr.length}`);
        switch (arr.length) {
        case 1:
            var key = Object.keys(val)[arr[0]]; //fetched the key at index arr[0]
            rv = rv.concat(embellish(arr[0], val[key]));  // fetching all the polygons in that partition
            break;
        case 2:
            var _key = Object.keys(val)[arr[0]]; //fetched the key at index arr[0]
            const partition = val[_key];
            rv.push( Object.assign({}, partition[arr[1]], {key: strKey}) );
            break;
        default:
            assert.fail('selectors/index.js :: impossible');
        }
    });

    return rv;
}


export function existingRegionsAsAntdTreeControlData(state) {
    return reduxRegionsToAntdData(state.regions.existing.val);
}

export function overlapExistingRegionsAsTreeData (state) {
    return  reduxRegionsToAntdData(state.regions.overlaps.regions);
}

export function rgeMode(state) { // region editing mode
    return state.regions.editing.mode;
}

// returns an array of partition names
export function partitions(state) {
    return Object.keys(state.regions.existing.val);
}

export function partition2regions(state) {
    const {val} = state.regions.existing;
    const rv = {};
    for (const [key, value] of Object.entries(val)) {
        rv[key] = value.map( (x)=>x.name );
    }
    return rv;
}

export function wktRegionUnderConstruction(state) {
    return state.regions.editing.regionUnderCreation?.wkt ?? null;
}

export function wktRegionUnderConstructionExists(state) {
    return (wktRegionUnderConstruction(state) !== null);
}

export function rgmgmntDuringDeletion(state) {
    return state.regions.editing.duringDeletion;
}

export function rgmgmntDuringModification(state) {
    return state.regions.editing.duringModification;
}

export function rgmgmntSaveEnabled(state) {
    return (wktRegionUnderConstructionExists(state) && (!rgmgmntDuringDeletion(state)) && (!rgmgmntDuringModification(state)));
}

