export const MODAL_LOGIN        = 'MODAL_LOGIN';
export const MODAL_ADD_GEOMETRY = 'MODAL_ADD_GEOMETRY';

export function isValidModalType(modalType) {
  const validModalTypes = [MODAL_LOGIN, MODAL_ADD_GEOMETRY];
  return (validModalTypes.indexOf(modalType)!==-1);
}

