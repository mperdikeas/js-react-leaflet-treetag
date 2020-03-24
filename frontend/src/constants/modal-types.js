export const MODAL_LOGIN        = 'MODAL_LOGIN';
export const MODAL_ADD_GEOMETRY = 'MODAL_ADD_GEOMETRY';
export const MDL_SAVE_WS_2_DSK  = 'MDL_SAVE_WS_2_DSK';  // Modal Save Workspace to Disk
export const MDL_INS_GJSON_2_WS = 'MDL_INS_GJSON_2_WS'; // Modal Insert GeoJSON to Workspace
export function isValidModalType(modalType) {
    const validModalTypes = [MODAL_LOGIN, MODAL_ADD_GEOMETRY, MDL_SAVE_WS_2_DSK, MDL_INS_GJSON_2_WS];
    return (validModalTypes.indexOf(modalType)!==-1);
}

