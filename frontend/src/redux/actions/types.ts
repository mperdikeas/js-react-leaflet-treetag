import {Dispatch} from 'react';

import {ActionType, SET_TREE_INFO_CURRENT, SET_TREE_INFO_ORIGINAL} from './action-types.ts';


import {TreeInfoWithId} from '../../backend.d.ts';

export type ActionUpdateMouseCoords = StandardAction<{latlng: string}>




//export type ModalNotificationAction = StandardAction<{html: string, uuid: string}>

export type ActionSetTreeInfoCurrent  = {type: (typeof SET_TREE_INFO_CURRENT), payload: TreeInfoWithId};
export type ActionSetTreeInfoOriginal = {type: (typeof SET_TREE_INFO_ORIGINAL), payload: TreeInfoWithId};
export type ActionSaveFeatData        = (dispatch: Dispatch<any>)=>void;

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

export type Action = StandardAction<any> | ActionUpdateMouseCoords | ActionNoPayload | ActionSetTreeInfoCurrent | ActionSetTreeInfoOriginal | ActionSaveFeatData;