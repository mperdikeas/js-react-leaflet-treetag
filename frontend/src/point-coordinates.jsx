const     _ = require('lodash');
const     $ = require('jquery');
const React = require('react');
import proj4 from 'proj4';

// https://spatialreference.org/ref/epsg/2100/
proj4.defs([
  [
    'EPSG:2100',
    '+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=0 +ellps=GRS80 +towgs84=-199.87,74.79,246.62,0,0,0,0 +units=m +no_defs']
]);
const WGS84  = 'EPSG:4326';
const HGRS87 = 'EPSG:2100';


export default function PointCoordinates({coords}) {
  if (coords===null)
    return null;
  else {
    const {lat, lng} = coords;
    const precisionA = 6;
    const precisionB = 8;
    const formatA = `${lat.toPrecision(precisionA)}:${lng.toPrecision(precisionA)}`;
    const [hgrs87lat, hgrs87long] = proj4(WGS84, HGRS87, [lng, lat]);
    const formatB = `${hgrs87lat.toPrecision(precisionB)}:${hgrs87long.toPrecision(precisionB)}`;
    return (
      <>
      <div class="col-sm">
          Συντ/μένες: {formatA}
      </div>
      <div class="col-sm">
          ΕΓΣΑ '87 {formatB}
      </div>    
    </>
    );
  }
}
