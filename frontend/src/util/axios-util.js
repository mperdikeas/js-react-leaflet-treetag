import {GSN, globalGet, globalSet} from '../globalStore.js';

export const OP_NO_LONGER_RELEVANT = 'op-no-longer-relevant';



export const CANCEL_TOKEN_TYPES = {
    GET_REGIONS: 'get_regions'

};


export function cancelIncompatibleRequests(type)  {
    switch (type) {
    case CANCEL_TOKEN_TYPES.GET_REGIONS:
        break;
    default:
        throw `unrecognized token type: [${type}]`;
    }
}


export function addCancelToken(type, token)  {
    const tokens = globalGet(GSN.AXIOS_CANCEL_TOKENS, false);
    const tokens2 = (tokens?tokens:[]);
    tokens2.push({type, token});
    globalSet(GSN.AXIOS_CANCEL_TOKENS, tokens2);
}
