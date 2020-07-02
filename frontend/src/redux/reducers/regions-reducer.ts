import existingRegionsReducer, {ExistingRegionsReducerState} from './existing-regions-reducer.ts';
import editingRegionsReducer, {EditingRegionsReducerState}   from './editing-regions-reducer.ts';
import overlappingRegionsReducer from './overlappingRegionsReducer.js';

export type RegionsReducerState = {
    existing: ExistingRegionsReducerState,
    editing: EditingRegionsReducerState,
    overlaps: any
}

import {Action} from '../actions/action-types.ts';

export default (state: RegionsReducerState | null = null, action: Action): RegionsReducerState => {
    return {
        existing: existingRegionsReducer      (state?.existing??undefined, action)
        , editing: editingRegionsReducer      (state?.editing??undefined, action)
        , overlaps: overlappingRegionsReducer (state?.overlaps??undefined, action)
    };
}

