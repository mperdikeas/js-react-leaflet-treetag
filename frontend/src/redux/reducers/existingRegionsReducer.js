import {GET_REGIONS_IN_PROGRESS
        , GET_REGIONS_SUCCESS
        , UPDATE_SELECTED_REGIONS}  from '../actions/action-types.js';

import chai from '../../util/chai-util.js';
const assert = require('chai').assert;


/*

val
 |
 +------όνομα διαμοίρασης 1: List of:
 |                              |
 |                              +---- name
 |                              +---- wkt
 |
 +------όνομα διαμοίρασης 2: ..

*/

// TODO: get rid of this conversion attrocity

// converts a Map: regionName => {name, wkt} to a List of {name, wkt}
function convertMapToList(regionNames2region) {
    const rv = [];
    for (const [key, value] of Object.entries(regionNames2region)) {
        const {name, wkt} = value;
        assert.strictEqual(key, name);
        rv.push({name, wkt});
    }
    return rv;
}

function convert(v) {
    const rv = {};
    for (const [key, value] of Object.entries(v)) {
        rv[key] = convertMapToList(value);
    }
    return rv;
}

export default (state = {val: {}, selected: [], state: 'steady'}, action) => {
    switch (action.type) {
    case GET_REGIONS_IN_PROGRESS: {
        return Object.assign({}, state, {state: 'fetching'});
    }
    case GET_REGIONS_SUCCESS: {
        return Object.assign({}, state, {val: convert(action.payload), state: 'steady'});
    }
    case UPDATE_SELECTED_REGIONS: {
        return Object.assign({}, state, {selected: action.payload});
    }
    default:
        return state;
    }
}

