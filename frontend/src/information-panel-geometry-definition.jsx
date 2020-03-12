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
    return (
      <div id='detailInformation' class='col-4 padding-0' style={{backgroundColor: 'lightgrey'}}>
        Ορισμός Γεωμετρίας.
      </div>
    );
  }
}
      

export default InformationPanelGeometryDefinition;

