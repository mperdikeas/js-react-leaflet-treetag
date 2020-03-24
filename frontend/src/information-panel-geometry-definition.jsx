require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

require('./css/information-panel.css');

import L from 'leaflet';
//import '../node_modules/leaflet-geometryutil/src/leaflet.geometryutil.js';

// import {geometriesValues, geometriesNames}     from './app-utils.js';

//import '../node_modules/leaflet-draw/dist/leaflet.draw.js';
import 'leaflet-draw';


// redux
import { connect }          from 'react-redux';
import {changeTileProvider} from './actions/index.js';



const mapStateToProps = (state) => {
  return {
    userDefinedGeometries: state.userDefinedGeometries
  }
};

class InformationPanelGeometryDefinition extends React.Component {

  constructor(props) {
    super(props);
    console.log('InformationPanelGeometryDefinition:: constructor');
    this.state = {
    };
  }

  render() {
    const style1 = {
//      backgroundColor: 'red',
      padding: '2px'
    };
    const style2 = {
      backgroundColor: 'blue',
      padding: '2px'
    };

    const geometries = this.props.userDefinedGeometries.map((x)=>{
      console.log(x.polygon);
      const area = L.GeometryUtil.geodesicArea(x.polygon.getLatLngs());
      console.log(`area is ${area}`);
      return (
        <div key={x.polygonId} className='row no-gutters' style={style1}>
          {x.geometryName}: {L.GeometryUtil.geodesicArea(x.polygon.getLatLngs())} εμβαδόν
        </div>
      );
    });
    
    return (
      <div id='detailInformation' className='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
        <div style={{backgroundColor: 'red'}}>
          <div className='row no-gutters' style={style1}>
            Έχετε ορίσει τις παρακάτω γεωμετρίες
          </div>
          {geometries}
        </div>
        <div className='row no-gutters' style={style2}>
            Γεωμετρία υπό ορισμό
        </div>        
      </div>
    );
  }
}
      

export default connect(mapStateToProps, null)(InformationPanelGeometryDefinition);

