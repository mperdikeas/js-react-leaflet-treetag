import {InformationPanelPane} from '../../information-panel-tree.tsx';
import {ActionTypeKeys} from '../actions/action-type-keys.ts';

export default (state = InformationPanelPane.INFORMATION, action) => {
    switch (action.type) {
    case ActionTypeKeys.SET_PANE_TO_OPEN_INFO_PANEL:
        return action.payload.pane;
    default:
        return state;
    }
}
