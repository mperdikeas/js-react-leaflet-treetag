export type ActionUpdateMouseCoords = StandardAction<{latlng: string}>

export type ActionToggleMaximizeInfoPanel = ActionNoPayload;
export type ActionUnsetTarget             = ActionNoPayload;
export type ActionGetFeatureAjaxConcluded = ActionNoPayload;
export type ActionRevertTreeCoords        = ActionNoPayload;
export type ActionGetRegionsInProgress    = ActionNoPayload;
export type ActionRevertTreeInfo          = ActionNoPayload;


export type StandardAction<T> = {
    readonly type: string,
    readonly payload: T
}

export type ActionNoPayload = {
    readonly type: string
}

export type Action = StandardAction<any> | ActionUpdateMouseCoords | ActionNoPayload;