import {ActionType} from './action-types.ts';
export type ActionUpdateMouseCoords = StandardAction<{latlng: string}>

export type ActionToggleMaximizeInfoPanel = ActionNoPayload;
export type ActionUnsetTarget             = ActionNoPayload;
export type ActionGetFeatureAjaxConcluded = ActionNoPayload;
export type ActionRevertTreeCoords        = ActionNoPayload;
export type ActionGetRegionsInProgress    = ActionNoPayload;
export type ActionRevertTreeInfo          = ActionNoPayload;


export type StandardAction<T> = {
    readonly type: ActionType,
    readonly payload: T
}

export type ActionNoPayload = {
    readonly type: ActionType
}

export type Action = StandardAction<any> | ActionUpdateMouseCoords | ActionNoPayload;