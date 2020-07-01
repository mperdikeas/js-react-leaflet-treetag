import {Dispatch} from 'react';

import {ActionTypeKeys} from './action-type-keys.ts';
import {Coordinates, TreeInfoWithId} from '../../backend.d.ts';

export type ActionUpdateMouseCoords = {
    readonly type: ActionTypeKeys.UPDATE_MOUSE_COORDS,
    readonly payload: {latlng: string}
};

export type ActionDisplayModal = {
    readonly type: ActionTypeKeys.DISPLAY_MODAL,
    readonly payload: {modalType: string,
                       modalProps: any}
};

export type ActionDisplayModalLogin = {
    readonly type: ActionTypeKeys.DISPLAY_MODAL,
    readonly payload: {modalType: string, // TODO: nail that
                       modalProps: {uuid: string, followUpFunc: ()=>void}}
};

export type ActionDisplayModalNotification = {
    readonly type: ActionTypeKeys.DISPLAY_MODAL,
    readonly payload:  {modalType: string, // TODO: nail that
                        modalProps: {html: string, uuid: string}
                       }
};

export type ActionDisplayModalNewRegionDefinition = {
    readonly type: ActionTypeKeys.DISPLAY_MODAL,
    readonly payload: {modalType: string,
                       modalProps: {uuid: string}}
};

export type ActionClearModal = {
    readonly type: ActionTypeKeys.CLEAR_MODAL,
    readonly payload: string
}



export type ActionToggleMaximizeInfoPanel = {
    readonly type: ActionTypeKeys.TOGGLE_MAXIMIZE_INFO_PANEL
}


export type ActionUnsetTarget = {
    readonly type: ActionTypeKeys.UNSET_TARGET
}

export type ActionSetPaneToOpenInfoPanel = {
    readonly type: ActionTypeKeys.SET_PANE_TO_OPEN_INFO_PANEL,
    readonly payload: {pane: string}
}

export type ActionUnsetOrFetch = (dispatch: Dispatch<any>, getState: any) => void;

export type ActionNewTarget = {
    readonly type: ActionTypeKeys.NEW_TARGET,
    readonly payload: {targetId: number}
}

export type ActionAddToast = {
    readonly type: ActionTypeKeys.ADD_TOAST,
    readonly payload: {header: string, msg: string}
}


export type ActionDismissToast = {
    readonly type: ActionTypeKeys.DISMISS_TOAST,
    readonly payload: {id: number}
}

export type ActionGetTreeInfoInProgress = {
    readonly type: ActionTypeKeys.GET_TREE_INFO_IN_PROGRESS,
    readonly payload: {id: number, axiosSource: any}
}

export type ActionGetFeatNumPhotosInProgress = {
    readonly type: ActionTypeKeys.GET_FEAT_NUM_PHOTOS_IN_PROGRESS,
    readonly payload: {id: number, axiosSource: any}
}

export type ActionGetFeatPhotoInProgress = {
    readonly type: ActionTypeKeys.GET_FEAT_PHOTO_IN_PROGRESS,
    readonly payload: {id: number, idx: number, axiosSource: any}
}

export type ActionDelFeatPhotoInProgress = {
    readonly type: ActionTypeKeys.DEL_FEAT_PHOTO_IN_PROGRESS,
    readonly payload: {id: number, idx: number}
}

export type ActionGetFeatureAjaxConcluded = {
    readonly type: ActionTypeKeys.GET_FEAT_AJAX_CONCLUDED
}

export type ActionGetTreeInfoSuccess = {
    readonly type: ActionTypeKeys.GET_TREE_INFO_SUCCESS,
    readonly payload: TreeInfoWithId
}

export type ActionGetFeatNumPhotosSuccess = {
    readonly type: ActionTypeKeys.GET_FEAT_NUM_PHOTOS_SUCCESS,
    readonly payload: number
}

export type ActionGetFeatPhotoSuccess = {
    readonly type: ActionTypeKeys.GET_FEAT_PHOTO_SUCCESS,
    readonly payload: {img: any, t: any}
}

export type ActionSetTreeInfoCurrent = {
    readonly type: ActionTypeKeys.SET_TREE_INFO_CURRENT,
    readonly payload: TreeInfoWithId
}


export type ActionSetTreeInfoOriginal = {
    readonly type: ActionTypeKeys.SET_TREE_INFO_ORIGINAL,
    readonly payload: TreeInfoWithId
}

export type ActionRevertTreeInfo = {
    readonly type: ActionTypeKeys.REVERT_TREE_INFO
}

export type ActionSetTreeCoordsOriginal = {
    readonly type: ActionTypeKeys.SET_TREE_COORDS_ORIGINAL,
    readonly payload: Coordinates
}
export type ActionSetTreeCoords = {
    readonly type: ActionTypeKeys.SET_TREE_COORDS,
    readonly payload: Coordinates
}

export type ActionRevertTreeCoords = {
    readonly type: ActionTypeKeys.REVERT_TREE_COORDS
}

export type ActionGetRegionsInProgress = {
    readonly type: ActionTypeKeys.GET_REGIONS_IN_PROGRESS,
}

export type ActionGetRegionsSuccess = {
    readonly type: ActionTypeKeys.GET_REGIONS_SUCCESS,
    readonly payload: any
}

export type ActionUpdateSelectedRegions = {
    readonly type: ActionTypeKeys.UPDATE_SELECTED_REGIONS,
    readonly payload: any
}

export type ActionOverlapsUpdateSelectedRegion = {
    readonly type: ActionTypeKeys.OVERLAPS_UPDATE_SELECTED_REGION,
    readonly payload: any
}


export type ActionOverlapsGetRegionsSuccess = {
    readonly type: ActionTypeKeys.OVERLAPS_GET_REGIONS_SUCCESS,
    readonly payload: any
}

export type ActionOverlapsSetRegion = {
    readonly type: ActionTypeKeys.OVERLAPS_SET_REGION,
    readonly payload: any
}


export type ActionOverlapsSetPartitions = {
    readonly type: ActionTypeKeys.OVERLAPS_SET_PARTITIONS,
    readonly payload: any
}

export type ActionOverlapsGetOverlapsInProgress = {
    readonly type: ActionTypeKeys.OVERLAPS_GET_OVERLAPS_IN_PROGRESS
}

export type ActionOverlapsGetOverlapsSuccess = {
    readonly type: ActionTypeKeys.OVERLAPS_GET_OVERLAPS_SUCCESS,
    readonly payload: any
}

export type ActionUpdateConfiguration = {
    readonly type: ActionTypeKeys.UPDATE_CONFIGURATION,
    readonly payload: any
}

export type ActionUpdateTrees = {
    readonly type: ActionTypeKeys.UPDATE_TREES,
    readonly payload: any
}

export type ActionSaveFeatData        = (dispatch: Dispatch<any>)=>void;


export type ActionRgmgmntDeleteStart = {
    readonly type: ActionTypeKeys.REG_MGMNT_DELETE_START
}

export type ActionRgmgmntDeleteEnd = {
    readonly type: ActionTypeKeys.REG_MGMNT_DELETE_END
}

export type ActionRgmgmntModifyStart = {
    readonly type: ActionTypeKeys.REG_MGMNT_MODIFY_START
}

export type ActionRgmgmntModifyEnd = {
    readonly type: ActionTypeKeys.REG_MGMNT_MODIFY_END
}


export type Action =
    | ActionUpdateMouseCoords
    | ActionDisplayModal
    | ActionDisplayModalLogin
    | ActionDisplayModalNotification
    | ActionDisplayModalNewRegionDefinition
    | ActionClearModal
    | ActionToggleMaximizeInfoPanel
    | ActionUnsetTarget
    | ActionSetPaneToOpenInfoPanel
    | ActionUnsetOrFetch
    | ActionNewTarget
    | ActionAddToast
    | ActionDismissToast
    | ActionGetTreeInfoInProgress
    | ActionGetFeatNumPhotosInProgress
    | ActionGetFeatPhotoInProgress
    | ActionDelFeatPhotoInProgress
    | ActionGetFeatureAjaxConcluded
    | ActionGetTreeInfoSuccess
    | ActionGetFeatNumPhotosSuccess
    | ActionGetFeatPhotoSuccess
    | ActionSetTreeInfoCurrent
    | ActionSetTreeInfoOriginal
    | ActionRevertTreeInfo
    | ActionSetTreeCoordsOriginal
    | ActionSetTreeCoords
    | ActionRevertTreeCoords
    | ActionGetRegionsInProgress
    | ActionGetRegionsSuccess
    | ActionUpdateSelectedRegions
    | ActionOverlapsUpdateSelectedRegion
    | ActionOverlapsGetRegionsSuccess
    | ActionOverlapsSetRegion
    | ActionOverlapsSetPartitions
    | ActionOverlapsGetOverlapsInProgress
    | ActionOverlapsGetOverlapsSuccess
    | ActionUpdateConfiguration
    | ActionUpdateTrees
    | ActionRgmgmntDeleteStart
    | ActionRgmgmntDeleteEnd
    | ActionRgmgmntModifyStart
    | ActionRgmgmntModifyEnd;
