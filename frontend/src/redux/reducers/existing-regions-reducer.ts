import {ActionTypeKeys} from '../actions/action-type-keys.ts';

import {PartitionsForInstallation} from '../../backend.d.ts';
import {Action} from '../actions/action-types.ts';

export type ExistingRegionsReducerState = PartitionsForInstallation | undefined;

export default (state: ExistingRegionsReducerState = undefined, action: Action): ExistingRegionsReducerState => {
    switch (action.type) {
    case ActionTypeKeys.GET_REGIONS_IN_PROGRESS: {
        return undefined;
    }
    case ActionTypeKeys.GET_REGIONS_SUCCESS: {
        return action.payload;
    }
    default:
        return state;
    }
}

