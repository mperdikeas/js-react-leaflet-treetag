import chai from '../../util/chai-util.js';
const assert = chai.assert;

import {Action} from '../actions/types.ts';

import configurationReducer           from './configuration-reducer.js';
import treesReducer                   from './trees-reducer.js';
import toastReducer                   from './toastReducer.js';
import mouseCoordsReducer             from './mouseCoordsReducer.js';
import targetReducer                  from './targetReducer.js';
import modalReducer                   from './modalReducer.js';
import maximizedInfoPanelReducer      from './maximizedInfoPanelReducer.js';
import paneToOpenInfoPanelReducer     from './paneToOpenInfoPanelReducer.js';
import regionsReducer                 from './regionsReducer.js';



function rootReducer(state: any = {}, action: Action) {
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
