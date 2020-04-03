export const MODAL_APP_IS_LOADING = 'MODAL_APP_IS_LOADING';
export const MODAL_LOGIN          = 'MODAL_LOGIN';
export const MDL_SAVE_WS_2_DSK    = 'MDL_SAVE_WS_2_DSK';  // Modal Save Workspace to Disk
export const MDL_INS_GJSON_2_WS   = 'MDL_INS_GJSON_2_WS'; // Modal Insert GeoJSON to Workspace
export function isValidModalType(modalType) {
    const validModalTypes = [MODAL_APP_IS_LOADING, MODAL_LOGIN, MDL_SAVE_WS_2_DSK, MDL_INS_GJSON_2_WS];
    return (validModalTypes.indexOf(modalType)!==-1);
}

