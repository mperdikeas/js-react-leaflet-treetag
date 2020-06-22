import {GET_REGIONS_IN_PROGRESS
        , GET_REGIONS_SUCCESS
        , UPDATE_SELECTED_REGIONS}  from '../actions/action-types.js';

import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {convert} from './reducer-util.js';

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

