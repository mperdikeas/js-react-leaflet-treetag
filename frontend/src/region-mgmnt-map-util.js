// reports the elements in [bs] that do not appear in [as]
function shallowDif(as, bs) {
    return bs.filter(x => !as.some(item => JSON.stringify(item)===JSON.stringify(x)));
}


/*
 * reports differences from as to bs
 */
export function regionListDiff(as, bs) {
    return {regionsAdded: shallowDif(as, bs)
            , regionsRemoved: shallowDif(bs, as)};
}
