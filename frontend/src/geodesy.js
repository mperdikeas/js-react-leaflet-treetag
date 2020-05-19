const assert = require('chai').assert;

// https://stackoverflow.com/a/11172685/274677
function haversineGreatCircleDistance(lat1, lon1, lat2, lon2){
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

// latDiff delta of latitude to meters, at latitude phi
// https://stackoverflow.com/a/19356480/274677
// https://en.wikipedia.org/wiki/Geographic_coordinate_system
function latitudeToMeters(latDiff, phi) {
    if (latDiff > 0.1)
        console.warn(`function latitudeToMeters() is supposed to be used with very small values of latitude difference - a value of ${latDiff} was used`);
    return latDiff*(111132.92 - 559.82*Math.cos(2*phi) + 1.175*Math.cos(4*phi) - 0.0023*Math.cos(6*phi));
}

// one degree of longitude to meters, at latitude phi
// https://stackoverflow.com/a/19356480/274677
// https://en.wikipedia.org/wiki/Geographic_coordinate_system
function longitudeToMeters(longDiff, phi) {
    if (longDiff > 0.1)
        console.warn(`function longitudeToMeters() is supposed to be used with very small values of longitude difference - a value of ${longDiff} was used`);
    return longDiff*(111412.84*Math.cos(phi) - 93.5*Math.cos(3*phi) + 0.118*Math.cos(5*phi));
}


exports.haversineGreatCircleDistance = haversineGreatCircleDistance;
exports.latitudeToMeters = latitudeToMeters;
exports.longitudeToMeters = longitudeToMeters;
