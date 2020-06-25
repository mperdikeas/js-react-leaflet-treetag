export type ActionUpdateMouseCoords = {
    readonly type: string,
    readonly payload: {latlng: string}
}

export type ActionToggleMaximizeInfoPanel = {
    readonly type: string
}

export type ActionUnsetTarget = {
    readonly type: string
}

export type ActionGetFeatureAjaxConcluded = {
    readonly type: string
}

export type ActionRevertTreeCoords = {
   readonly type: string
}

export type ActionGetRegionsInProgress = {
   readonly type: string
}

export type ActionRevertTreeInfo = {
   readonly type: string
}


export type ActionNoPayload = {
    readonly type: string
}

export type Action = ActionUpdateMouseCoords | ActionNoPayload;