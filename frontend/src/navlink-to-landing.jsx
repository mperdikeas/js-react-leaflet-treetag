const React = require('react');
var      cx = require('classnames');

import chai from './util/chai-util.js';
const assert = chai.assert;


import {Nav} from 'react-bootstrap';
import { withRouter } from 'react-router-dom'

import {NAV_OPTIONS, URLS} from './constants/navig-constants.js';
const {LANDING_PAGE} = NAV_OPTIONS;
const {MAIN} = URLS;


class NavLinkToLanding extends React.Component {


  constructor(props) {
    super(props);
    console.log('cac 2 - ', this.props.history);
  }

  navigate = (selectedKey) => {
    switch (selectedKey) {
      case LANDING_PAGE:
        this.props.history.push(MAIN);
        break;
      default:
        throw `unhandled key: ${selectedKey}`;
    }
  }


  render() {
    return (
      <Nav variant='pills' justify={true} className='flex-row' onSelect={this.navigate} >
        <Nav.Item>
          <Nav.Link eventKey={LANDING_PAGE}>Αρχική</Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}



export default withRouter(NavLinkToLanding);
