import {INFORMATION}                 from '../../constants/information-panel-panes.js';
import {SET_PANE_TO_OPEN_INFO_PANEL} from '../actions/action-types.ts';

export default (state = INFORMATION, action) => {
    switch (action.type) {
    case SET_PANE_TO_OPEN_INFO_PANEL:
        return action.payload.pane;
    default:
        return state;
    }
}
