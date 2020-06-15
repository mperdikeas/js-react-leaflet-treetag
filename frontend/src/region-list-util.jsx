const assert = require('chai').assert;

export function arr2str(vs) {
  const rv =  vs.map( x=>x.toString()).join('-')
  return rv;
}

export function str2arr(s) {
  const rv = s.split('-').map( x=>parseInt(x) );
  return rv;
}

function getRegion(regions, strKey) {

}

export function getRegions(regions, strKeys) {
  let rv = [];
  strKeys.forEach( strKey => {
    const arr = str2arr(strKey);
    assert.isTrue((arr.length===1) || (arr.length===2)
                , `region-list-util.jsx :: arr ${arr} had length ${arr.length}`);
    console.log(`fetching region with key ${strKey}`);
    switch (arr.length) {
      case 1:
        var key = Object.keys(regions)[arr[0]]; //fetched the key at index arr[0]
        rv = rv.concat(regions[key]);                    // fetching all the polygons in that partition
        console.log('rv is now: ', rv);
        break;
      case 2:
        var _key = Object.keys(regions)[arr[0]]; //fetched the key at index arr[0]
        const partition = regions[_key];
        rv.push( Object.assign({}, partition[arr[1]], {key: strKey}) );
      default:
        assert.fail('region-list-util.jsx :: impossible');
    }
  });
  return rv;
}
