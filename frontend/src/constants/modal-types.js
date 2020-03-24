export const MODAL_LOGIN        = 'MODAL_LOGIN';
export const MODAL_ADD_GEOMETRY = 'MODAL_ADD_GEOMETRY';
export const MDL_SAVE_WS_2_DSK  = 'MDL_SAVE_WS_2_DSK'; // Modal Save Workspace To Disk
export function isValidModalType(modalType) {
  const validModalTypes = [MODAL_LOGIN, MDL_SAVE_WS_2_DSK, MODAL_ADD_GEOMETRY];
  return (validModalTypes.indexOf(modalType)!==-1);
}

