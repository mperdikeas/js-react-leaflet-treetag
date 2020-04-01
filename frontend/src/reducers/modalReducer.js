import {DISPLAY_MODAL, CLEAR_MODAL, ADD_GEOMETRY} from '../constants/action-types.js';

import {MODAL_LOGIN, MODAL_ADD_GEOMETRY} from '../constants/modal-types.js';

export default (state = {modal: {modalType: MODAL_LOGIN, modalProps: null}}, action) => {
    switch (action.type) {
    case DISPLAY_MODAL:
        return {modal: {modalType: action.payload.modalType, modalProps: action.payload.modalProps}};
    case ADD_GEOMETRY: // TODO: I don't think this is used anymore
        return {modal: null};
    case CLEAR_MODAL:
        console.log('returning null in response to CLEAR_MODAL action');
        console.log(action.payload.followUpFunction);
        if (action.payload) {
            if (action.payload.followUpFunction) {
                console.log('calling follow up function');
                action.payload.followUpFunction();
            } else
                console.log('no follow up function upon clear modal');
        } else {
            throw `unrecognized shape for the payload of action [${CLEAR_MODAL}]`;
        }
        return {modal: null};
    default:
        return state;
    }
}
