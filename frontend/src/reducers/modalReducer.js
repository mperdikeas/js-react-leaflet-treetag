const assert = require('chai').assert;

import {APP_IS_DONE_LOADING
        , DISPLAY_MODAL
        , CLEAR_MODAL
        , ADD_GEOMETRY} from '../constants/action-types.js';

import {MODAL_APP_IS_LOADING
        , MODAL_LOGIN} from '../constants/modal-types.js';

export default (modals = [{modalType: MODAL_LOGIN, modalProps: null}
                          , {modalType: MODAL_APP_IS_LOADING, modalProps: null}]
                , action) => {
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
                    case APP_IS_DONE_LOADING: {
                        console.log(`yyyyyyyyy modalreducer ${modals.length} modals`);
                        const modals2 = [...modals];
                        const modalToClose =modals2.pop();
                        console.log(modalToClose);
                        assert.strictEqual(modalToClose.modalType, MODAL_APP_IS_LOADING);
                        // this modal has no props
                        return modals2;
                    }
                    case CLEAR_MODAL: {
                        console.log(`xxxxxxxxxxxx modalreducer ${modals.length} modals`);
                        const modals2 = [...modals];
                        const modalToClose =modals2.pop();
                        console.log(modalToClose);
                        if (modalToClose.modalProps) {
                            console.log(modalToClose.modalProps.followUpFunction);
                            if (modalToClose.modalProps.followUpFunction) {
                                console.log('calling follow up function');
                                /* without the setTimeout I encountered the following problem:
                                 * Error: You may not call store.getState() while the reducer is executing.” 🤔
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
                    }
                    default: {
                        return modals;
                    }
                    }
                }
