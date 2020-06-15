import {GET_REGIONS_IN_PROGRESS, GET_REGIONS_SUCCESS}  from '../actions/action-types.js';



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
          return {val: action.payload, state: 'steady'};
    }
    default:
        return state;
    }
}

