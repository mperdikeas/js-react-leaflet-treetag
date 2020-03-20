import {CHANGE_TILE_PROVIDER} from '../constants/action-types.js';

export function changeTileProvider(tileProviderId) {
    return { type: CHANGE_TILE_PROVIDER, tileProviderId };
};
