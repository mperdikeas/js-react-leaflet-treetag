const assert = require('chai').assert;

export function arr2str(vs) {
  const rv =  vs.map( x=>x.toString()).join('-')
  console.log(`ccc ${rv}`);
  return rv;
}

export function str2arr(s) {
  const rv = s.split('-').map( x=>parseInt(x) );
  console.log(`ccc ${s} became:`);
  console.log(rv);
  return rv;
}

export function getRegion(regions, strKey) {
  const arr = str2arr(strKey);
  console.log('ccc', arr);
  assert.isTrue((arr.length===1) || (arr.length===2)
              , `region-list-util.jsx :: arr ${arr} had length ${arr.length}`);
  switch (arr.length) {
    case 1:
      var key = Object.keys(regions)[arr[0]]; //fetched the key at index arr[0]
      return regions[key];
    case 2:
      console.log(`ccc, ${JSON.stringify(arr)}`);
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
