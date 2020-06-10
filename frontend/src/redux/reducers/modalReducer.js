const assert = require('chai').assert;

const React = require('react');

import {DISPLAY_MODAL, CLEAR_MODAL} from '../actions/action-types.js';


export default (modals = [], action) => {
    switch (action.type) {
    case DISPLAY_MODAL: {
        const newModal = {modalType: action.payload.modalType, modalProps: action.payload.modalProps};
        return [...modals, newModal];
    }
    case CLEAR_MODAL: {
        const uuid = action.payload;
        console.log(`looking for [${uuid}] among ${modals.length} modals`);
        let j = 0;
        let idxs = [];
        if (modals.length>0) {
            const modals2 = [];
            modals.forEach( (modal) => {
                assert.isDefined(modal.modalProps.uuid);
                assert.isNotNull(modal.modalProps.uuid);
                if (modal.modalProps.uuid !== uuid)
                    modals2.push(Object.assign({}, modal));
                else {
                    const modalToClose = modal;
                    if (modalToClose.modalProps.followUpFunc) {
                        throw 'I believe this to be DEAD code - remove it in a few days!';
                        /* without the setTimeout I encountered the following problem:
                         *
                         *     Error: You may not call store.getState() while the reducer is executing.
                         *
                         * I can't explain the root cause of the problem and also, it didn't occur
                         * in the target-photo-pane.jsx at all; it only occured at the 
                         * target-data-pane.jsx and target-metadata-pane.jsx
                         */

                        /*
                         * TODO: is this really a useful pattern?
                         */

                        setTimeout(()=>modalToClose.modalProps.followUpFunc(), 0);
                    }
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
            return modals2;
        } else
            return modals;
    }
    default: {
        return modals;
    }
    }
}
