const assert = require('chai').assert;

export function arr2str(vs) {
  return vs.map( x=>x.toString()).join('-')
}

export function str2arr(s) {
  return s.split('-').map( x=>parseInt(x) );
}

export function getRegion(regions, strKey) {
  const arr = str2arr(strKey);
  assert.isTrue((arr.length===1) || (arr.length===2)
              , `region-list-util.jsx :: arr ${arr} had length ${arr.length}`);
  switch (arr.length) {
    case 1:
      var key = Object.keys(regions)[arr[0]]; //fetched the key at index arr[0]
      return regions[key];
    case 2:
      var key = Object.keys(regions)[arr[0]]; //fetched the key at index arr[0]
      const partition = regions[key];
      return partition[arr[1]];
    default:
      assert.fail('region-list-util.jsx :: impossible');
  }
}

export function getRegions(regions, strKeys) {
  const rv = [];
  strKeys.forEach( strKey => {
    rv.push(getRegion(regions, strKey));
  });
  console.log('region-list-util.jsx, returning:');
  console.log(rv);
  return rv;
}
