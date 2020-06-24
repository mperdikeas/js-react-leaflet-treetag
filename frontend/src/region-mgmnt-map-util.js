import {deepDiff} from './util/util.js';

/*
 * reports differences from as to bs
 */
export function regionListDiff(as, bs) {
    console.log(as);
    console.log(bs);
    return {regionsAdded: deepDiff(as, bs)
            , regionsRemoved: deepDiff(bs, as)};
}
