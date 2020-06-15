import {GET_REGIONS_IN_PROGRESS
        , GET_REGIONS_SUCCESS
        , UPDATE_SELECTED_REGIONS}  from '../actions/action-types.js';



const assert = require('chai').assert;

/*

val
 |
 +------όνομα διαμοίρασης 1: Array of
 |                              |
 |                              +---- name
 |                              +---- wkt
 |
 +------όνομα διαμοίρασης 2: ..

*/


export default (state = {val: {}, selected: [], state: 'steady'}, action) => {
    switch (action.type) {
    case GET_REGIONS_IN_PROGRESS: {
        return Object.assign({}, state, {state: 'fetching'});
    }
    case GET_REGIONS_SUCCESS: {
        return Object.assign({}, state, {val: action.payload, state: 'steady'});
    }
    case UPDATE_SELECTED_REGIONS: {
        return Object.assign({}, state, {selected: action.payload});
    }
    default:
        return state;
    }
}

