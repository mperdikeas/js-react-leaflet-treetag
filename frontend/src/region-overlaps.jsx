const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import RegionMgmntMap                          from './region-mgmnt-map.jsx';
import RegionList                              from './region-list.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import UserControl                             from './user-control.jsx';

import wrapContexts                            from './context/contexts-wrapper.jsx';

import {Nav} from 'react-bootstrap';

// REDUX
import { connect }          from 'react-redux';

import { withRouter } from 'react-router-dom'


const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

const LANDING_PAGE = 'LANDING_PAGE';


class RegionOverlaps extends React.Component {


  constructor(props) {
    super(props);
  }

  onSelect = (selectedKey) => {
    switch (selectedKey) {
      case LANDING_PAGE:
        this.props.history.push('/main');
        break;
      default:
        throw `unhandled key: ${selectedKey}`;
    }
  }



  render() {
    const headerBarHeight = this.props.geometryContext.geometry.headerBarHeight;
    return (
      <div className='container-fluid' key='main-gui-component' style={{paddingRight: 0, paddingLeft: 0}}>
      <div className='row no-gutters justify-content-start align-items-center'
      style={{height: `${headerBarHeight}px`}}>


      <div className = 'col-8'>
        <Nav variant='pills' justify={true} className='flex-row' onSelect={this.onSelect} >
          <Nav.Item>
            <Nav.Link eventKey={LANDING_PAGE}>Αρχική</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <div className='col-4'>
        <UserControl/>
      </div>
      </div>
      <div className='row no-gutters'>
        <div className={cx({'col-12': true, 'padding-0': true})}>
          display table to select region for overlaps
        </div>
      </div>
      <div className='row no-gutters'>
        <div className={cx({'col-12': true, 'padding-0': true})}>
          search results
        </div>
      </div>      
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(wrapContexts(RegionOverlaps)));

