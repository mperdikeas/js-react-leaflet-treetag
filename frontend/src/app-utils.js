function geometriesValues(userDefinedGeometries) {
    return userDefinedGeometries.map( (x)=>x.value );
}

function geometriesNames(userDefinedGeometries) {
    return userDefinedGeometries.map( (x)=>x.name );
}

exports.geometriesValues = geometriesValues;
exports.geometriesNames = geometriesNames;
