/*
 * reports differences from as to bs
 */
export function regionListDiff(as, bs) {
    return {regionsAdded: bs.filter(x => !as.includes(x))
            , regionsRemoved: as.filter(x => !bs.includes(x))};
}
