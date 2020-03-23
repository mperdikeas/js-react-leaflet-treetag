export const MODAL_LOGIN        = 'MODAL_LOGIN';
export const MODAL_ADD_GEOMETRY = 'MODAL_ADD_GEOMETRY';
// TODO: change file to *.js

export function isValidModalType(modalType) {
  const validModalTypes = [MODAL_LOGIN, MODAL_ADD_GEOMETRY];
  return (validModalTypes.indexOf(modalType)!==-1);
}

