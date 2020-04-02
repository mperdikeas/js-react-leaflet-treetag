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

// redux
import { connect }          from 'react-redux';

const mapStateToProps = (state) => {
  return {latlng: state.latlng};
};

function PointCoordinates({latlng}) {
  if (latlng===null)
    return null;
  else {
    const {lat, lng} = latlng;
    const precisionA = 8;
    const precisionB = 8;
    const formatA = `${lat.toPrecision(precisionA)}:${lng.toPrecision(precisionA)}`;
    const [hgrs87lat, hgrs87long] = proj4(WGS84, HGRS87, [lng, lat]);
    const formatB = `${hgrs87lat.toPrecision(precisionB)}:${hgrs87long.toPrecision(precisionB)}`;
    return (
      <>
      <div style={{fontSize: 12}}>
        <div className='row no-gutters'>
          <div className="col-4">
            WGS84
          </div>
          <div className="col-8">
            {formatA}
          </div>
        </div>
        <div className='row no-gutters'>
          <div className="col-4">
            ΕΓΣΑ '87
          </div>
          <div className="col-8">
            {formatB}
          </div>
        </div>
      </div>
      </>
    );
  }
}


export default connect(mapStateToProps, null)(PointCoordinates);
