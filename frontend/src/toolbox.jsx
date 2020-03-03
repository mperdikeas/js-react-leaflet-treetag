const     _ = require('lodash')
const     $ = require('jquery')
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console

const React = require('react')
var      cx = require('classnames')

import PropTypes from 'prop-types'

const assert = require('chai').assert


class Toolbox extends React.Component {



  constructor(props) {
    super(props);
  }


  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    return (
      <div class='row no-gutters'>
        <div class='col-12'>
          a
        </div>
        <div class='col-12'>
          b
        </div>
        <div class='col-12'>
          c
        </div>
      </div>
    );
  }

}



export default Toolbox;

