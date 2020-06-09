import {GET_REGIONS_IN_PROGRESS, GET_REGIONS_SUCCESS}  from '../actions/action-types.js';



const assert = require('chai').assert;



export default (state = {regions: [], state: 'steady'}, action) => {
    switch (action.type) {
    case GET_REGIONS_IN_PROGRESS: {
        return Object.assign({}, state, {state: 'fetching'});
    }
    case GET_REGIONS_SUCCESS: {
        return {regions: action.payload, state: 'steady'};
    }
    default:
        return state;
    }
}

