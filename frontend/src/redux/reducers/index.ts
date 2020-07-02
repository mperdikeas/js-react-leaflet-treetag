import {Action} from '../actions/action-types.ts';

import configurationReducer           from './configuration-reducer.ts';
import treesReducer                   from './trees-reducer.js';
import toastReducer                   from './toast-reducer.ts';
import mouseCoordsReducer             from './mouseCoordsReducer.js';
import targetReducer                  from './target-reducer.ts';
import modalReducer                   from './modal-reducer.ts';
import maximizedInfoPanelReducer      from './maximizedInfoPanelReducer.js';
import paneToOpenInfoPanelReducer     from './paneToOpenInfoPanelReducer.js';
import regionsReducer                 from './regions-reducer.ts';

import {RootState} from '../types.ts';


function rootReducer(state: any = {}, action: Action): RootState {
    return {
        configuration        : configurationReducer        (state.configuration, action),
        trees                : treesReducer                (state.trees, action),
        toasts               : toastReducer                (state.toasts, action),
        latlng               : mouseCoordsReducer          (state.latlng, action),
        target               : targetReducer               (state.target, action),
        modals               : modalReducer                (state.modals, action),
        maximizedInfoPanel   : maximizedInfoPanelReducer   (state.maximizedInfoPanel, action),
        paneToOpenInfoPanel  : paneToOpenInfoPanelReducer  (state.paneToOpenInfoPanel, action),
        regions              : regionsReducer              (state.regions, action)
    };
};


export default rootReducer;
