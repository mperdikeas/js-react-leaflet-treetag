/*

This is the format returned from the server:

val
 |
 +------όνομα διαμοίρασης 1:----+
 |                              |
 |                              +--region name A--> wkt
 |                              +--region name B--> wkt
 |                              +--region name C--> wkt
 |
 +------όνομα διαμοίρασης 2: ..


This is the format held in my redux store:

val
 |
 +------όνομα διαμοίρασης 1: List of:
 |                              |
 |                              +---- name
 |                              +---- wkt
 |
 +------όνομα διαμοίρασης 2: ..

It is the job of the convert function to translate from the server format to the redux tree control format

TODO: eliminate this attrocity, just use the server format for crying out loud 
    refid: sse-1592587834

*/

// converts a Map: regionName => {name, wkt} to a List of {name, wkt}
function convertMapToList(regionNames2region) {
    const rv = [];
    for (const [key, value] of Object.entries(regionNames2region)) {
        const {name, wkt} = value;
        assert.strictEqual(key, name);
        rv.push({name, wkt});
    }
    return rv;
}

export function convert(v) {
    const rv = {};
    for (const [key, value] of Object.entries(v)) {
        rv[key] = convertMapToList(value);
    }
    return rv;
}
