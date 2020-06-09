const assert = require('chai').assert;

const React = require('react');

import {APP_IS_DONE_LOADING
        , DISPLAY_MODAL
        , CLEAR_MODAL} from '../actions/action-types.js';

import {MDL_NOTIFICATION_NO_DISMISS
        , MODAL_LOGIN} from '../../constants/modal-types.js';

export default (modals = [], action) => {
    switch (action.type) {
    case DISPLAY_MODAL: {
        const newModal = {modalType: action.payload.modalType, modalProps: action.payload.modalProps};
        return [...modals, newModal];
    }
    case APP_IS_DONE_LOADING: {
        /* TODO: the need for this check was introduced AFTER I started saving the redux
         * store in localStorage. I saw the assertion below failing when I was reloading
         * I suspect this is due to the map remounting (and so fetching the markers anew) and then dismissing the
         * modal that says "please wait while the application is loading".
         * I should definitely revisit this.
         */
        //                        if (modals.length !== 0) {
        const modals2 = [...modals];
        const modalToClose = modals2.pop();
        assert.strictEqual(modalToClose.modalType, MDL_NOTIFICATION_NO_DISMISS);
        return modals2;
        /*                      } else {
                                console.warn('check TODO in sources');
                                return modals;
                                }*/
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
                    if (modalToClose.modalProps.followUpFunction) {
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

                        setTimeout(()=>modalToClose.modalProps.followUpFunction(), 0);
                    }
                    j ++;
                    if (j>1)
                        console.warn(`Mighty weird: modal with UUID [${uuid}] encountered ${j} times so far!`);
                }
            });
            if (j===0)
                console.warn(`Mighty weird: no modal with UUID [${uuid}] was found`);
            return modals2;
        } else
            return modals;
    }
    default: {
        return modals;
    }
    }
}
