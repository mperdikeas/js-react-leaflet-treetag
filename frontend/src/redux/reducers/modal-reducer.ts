import chai from '../../util/chai-util.js'
const assert = chai.assert;

import {Action}         from '../actions/action-types.ts';
import {ActionTypeKeys} from '../actions/action-type-keys.ts';

export type Modal = {
    readonly modalType: any, // TODO
    readonly modalProps: any
};


export default (modals: Modal[] = [], action: Action): Modal[] => {
    switch (action.type) {
    case ActionTypeKeys.DISPLAY_MODAL: {
        const newModal = {modalType: action.payload.modalType, modalProps: action.payload.modalProps};
        const rv = [...modals, newModal];
        console.log(`cag - display modal - a total of ${rv.length} modals are now displayed`);
        return rv;
    }
    case ActionTypeKeys.CLEAR_MODAL: {
        const uuid = action.payload;
        console.log(`looking for [${uuid}] among ${modals.length} modals`);
        let j = 0;

        if (modals.length>0) {
            const modals2: Modal[] = [];
            modals.forEach( (modal) => {
                assert.isDefined(modal.modalProps.uuid);
                assert.isNotNull(modal.modalProps.uuid);
                if (modal.modalProps.uuid !== uuid)
                    modals2.push(Object.assign({}, modal));
                else {
                    const modalToClose: Modal = modal;
                    console.debug('This is the modal that get\'s closed:', modalToClose);
                    j ++;
                    if (j>1) {
                        console.warn(`Mighty weird: modal with UUID [${uuid}] encountered ${j} times so far!`);
                        throw 42;
                    }
                }
            });
            if (j===0) {
                console.warn(`Mighty weird: no modal with UUID [${uuid}] was found`);
                throw 42;
            }
            console.log(`cag - clear modals - ${modals2.length} modals now remain`);
            return modals2;
        } else {
            console.warn(`Mighty weird: a CLEAR_MODAL action was dispatched while no modals were displayed`);
            return modals;
        }
    }
    default: {
        return modals;
    }
    }
}
