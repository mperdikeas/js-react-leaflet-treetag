import chai from '../../util/chai-util.js';
const assert = require('chai').assert;

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
        console.log(`fetching region with key ${strKey}`);
        switch (arr.length) {
        case 1:
            var key = Object.keys(val)[arr[0]]; //fetched the key at index arr[0]
            rv = rv.concat(embellish(arr[0], val[key]));  // fetching all the polygons in that partition
            console.log('rv is now: ', rv);
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

    
    console.log('selected regions are: ', rv);
    return rv;
}


export function antdTreeControlData(state) {

    /*
     * cf. sse-1592215091
     * Map<String, List<Region>>
     * with Region being: <name: String, wkt: String>
     *
     *
     */

    function regions(i0, vs) {
        const rv = [];
        for (let i = 0; i < vs.length; i++) {
            const v = vs[i];
            const key = arr2str([i0, i]);
            rv.push({title: v.name
                     , value: key
                     , key: key});
        }
        return rv;
    }

    const rv = [];

    let i = 0;
    for (let [key, value] of Object.entries(state.regions.existing.val)) {
        const key2 = arr2str([i]);
        rv.push({title: key
                 , value: key2
                 , key: key2
                 , children: regions(i, value)});
        i++;
    }
    return rv;
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
