import {DISPLAY_MODAL, CLEAR_MODAL, ADD_GEOMETRY} from '../constants/action-types.js';

import {MODAL_LOGIN} from '../constants/modal-types.js';

export default (modals = [{modalType: MODAL_LOGIN, modalProps: null}], action) => {
    switch (action.type) {
    case DISPLAY_MODAL: {
        const modals2 = [...modals];
        const newModal = {modalType: action.payload.modalType, modalProps: action.payload.modalProps};
        modals2.push(newModal);
        return modals2;
    }
    case ADD_GEOMETRY: {// TODO: I don't think this is used anymore
        return {modal: null};
    }
    case CLEAR_MODAL: {
        console.log('xxxxxxxxxxxx modalreducer');
        const modals2 = [...modals];
        const modalToClose =modals2.pop();
        console.log(modalToClose);
        if (modalToClose.modalProps) {
            console.log(modalToClose.modalProps.followUpFunction);
            if (modalToClose.modalProps.followUpFunction) {
                console.log('calling follow up function');
                modalToClose.modalProps.followUpFunction();
            } else
                console.log('no follow up function upon clear modal');
        } else {
            console.log('no props at all in modal');
        }
        return modals2;
    }
    default: {
        return modals;
    }
    }
}
