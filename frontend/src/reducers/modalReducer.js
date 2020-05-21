const assert = require('chai').assert;

const React = require('react');

import {APP_IS_DONE_LOADING
        , DISPLAY_MODAL
        , CLEAR_MODAL} from '../constants/action-types.js';

import {MDL_NOTIFICATION_NO_DISMISS
        , MODAL_LOGIN} from '../constants/modal-types.js';

export default (modals = [{modalType: MODAL_LOGIN, modalProps: null}
                          , {modalType: MDL_NOTIFICATION_NO_DISMISS, modalProps: {html: (<span>Please wait while the app is loading &hellip;</span>)}}]
                , action) => {
                    switch (action.type) {
                    case DISPLAY_MODAL: {
                        const newModal = {modalType: action.payload.modalType, modalProps: action.payload.modalProps};
                        return [...modals, newModal];
                    }
                    case APP_IS_DONE_LOADING: {
                        const modals2 = [...modals];
                        const modalToClose = modals2.pop();
                        assert.strictEqual(modalToClose.modalType, MDL_NOTIFICATION_NO_DISMISS);
                        return modals2;
                    }
                    case CLEAR_MODAL: {
                        if (modals.length>0) {
                            console.log(`xxxxxxxxxxxx modalreducer ${modals.length} modals`);
                            const modals2 = [...modals];
                            const modalToClose =modals2.pop();
                            if (modalToClose.modalProps) {
                                if (modalToClose.modalProps.followUpFunction) {
                                    console.log('calling follow up function');
                                    /* without the setTimeout I encountered the following problem:
                                     *
                                     *     Error: You may not call store.getState() while the reducer is executing.
                                     *
                                     * I can't explain the root cause of the problem and also, it didn't occur
                                     * in the target-photo-pane.jsx at all; it only occured at the 
                                     * target-data-pane.jsx and target-metadata-pane.jsx
                                     */

                                    setTimeout(()=>modalToClose.modalProps.followUpFunction(), 0);
                                } else
                                    console.log('no follow up function upon clear modal');
                            } else {
                                console.log('no props at all in modal');
                            }
                            return modals2;
                        } else {
                            console.warn(`weird? clear modal called when no modals are present`);
                            return modals;
                        }
                    }
                    default: {
                        return modals;
                    }
                    }
                }
