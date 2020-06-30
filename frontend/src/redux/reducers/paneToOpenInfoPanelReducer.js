import {INFORMATION}                 from '../../constants/information-panel-panes.js';
import {ActionTypeKeys} from '../actions/action-type-keys.ts';

export default (state = INFORMATION, action) => {
    switch (action.type) {
    case ActionTypeKeys.SET_PANE_TO_OPEN_INFO_PANEL:
        return action.payload.pane;
    default:
        return state;
    }
}
