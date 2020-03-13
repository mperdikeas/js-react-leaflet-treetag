require('./css/style.css');
const     _ = require('lodash');
const     $ = require('jquery');


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;

require('./css/information-panel.css');


class InformationPanelGeometryDefinition extends React.Component {

  constructor(props) {
    super(props);
    console.log('InformationPanelGeometryDefinition:: constructor');
    this.state = {
    };
  }

  render() {
    const style1 = {
      backgroundColor: 'red',
      padding: '2px'
    };
    const style2 = {
      backgroundColor: 'blue',
      padding: '2px'
    };

    const geometries = this.props.geometriesNames.map((x)=>{
      return (
        <li>{x}</li>
      );
    });
    
    return (
      <div id='detailInformation' class='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
        <div class='row no-gutters' style={style1}>
          Έχετε ορίσει τις παρακάτω γεωμετρίες<br/>
          <ul>
            {geometries}
          </ul>

        </div>
        <div class='row no-gutters' style={style2}>
Γεωμετρία υπό ορισμό
        </div>        
      </div>
    );
  }
}
      

export default InformationPanelGeometryDefinition;

