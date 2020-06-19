import {GET_REGIONS_IN_PROGRESS
        , GET_REGIONS_SUCCESS
        , UPDATE_SELECTED_REGIONS}  from '../actions/action-types.js';



const assert = require('chai').assert;

import existingRegionsReducer    from './existingRegionsReducer.js';
import editingRegionsReducer     from './editingRegionsReducer.js';
import overlappingRegionsReducer from './overlappingRegionsReducer.js';

export default (state = {}, action) => {
    return {
        existing: existingRegionsReducer(state.existing, action)
        , editing: editingRegionsReducer(state.editing, action)
        , overlaps: overlappingRegionsReducer(state.overlaps, action)
    };
}

