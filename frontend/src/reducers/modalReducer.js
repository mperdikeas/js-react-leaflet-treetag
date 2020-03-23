import {DISPLAY_MODAL, CLEAR_MODAL, ADD_GEOMETRY} from '../constants/action-types.js';

export default (state = 'login', action) => {
    switch (action.type) {
    case DISPLAY_MODAL:
        return action.payload.modalType;
    case CLEAR_MODAL:
        return null;
    case ADD_GEOMETRY:
        return null;
    default:
        return state;
    }
}
