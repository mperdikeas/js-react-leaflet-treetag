/*
 * cf. sse-1592215091
 * Map<String, List<Region>>
 * with Region being: <name: String, wkt: String>
 *
 *
 */

// cf. sse-1592587834

export function arr2str(vs) {
    const rv =  vs.map( x=>x.toString()).join('-');
    return rv;
}


export function reduxRegionsToAntdData(val) {

    function regions(i0, vs) {
        const rv = [];
        for (let i = 0; i < vs.length; i++) {
            const v = vs[i];
            const key = arr2str([i0, i]);
            rv.push({title: v.name
                     , value: key
                     , key: key});
        }
        return rv;
    }

    const rv = [];

    let i = 0;
    for (let [key, value] of Object.entries(val)) {
        const key2 = arr2str([i]);
        rv.push({title: key
                 , value: key2
                 , key: key2
                 , children: regions(i, value)});
        i++;
    }
    return rv;
}
