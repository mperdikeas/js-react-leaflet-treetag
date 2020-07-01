const React = require('react');
var      cx = require('classnames');

import chai from './util/chai-util.js';
const assert = chai.assert;


import {Nav} from 'react-bootstrap';

import RegionMgmntMap                          from './region-mgmnt-map.tsx';
import RegionList                              from './region-list.tsx';
import PointCoordinates                        from './point-coordinates.tsx';
import UserControl                             from './user-control.jsx';

import wrapContexts                            from './context/contexts-wrapper.tsx';

import NavLinkToLanding from './navlink-to-landing.jsx';

// REDUX
import { connect }          from 'react-redux';


const mapStateToProps = (state) => {
  return {
  };
};




class RegionMgmnt extends React.Component {


  constructor(props) {
    super(props);
  }

  navigate = (selectedKey) => {
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
          <div className='col-4'>
            <PointCoordinates/>
          </div>
          <div className='col-4'>
            <NavLinkToLanding/>
          </div>
          <div className='col-4'>
            <UserControl/>
          </div>
        </div>
        <div className='row no-gutters'>
          <div className={cx({'col-8': true, 'padding-0': true})}>
            <RegionMgmntMap/>
          </div>
          <div className={cx({'col-4':true})}>
            <RegionList/>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(wrapContexts(RegionMgmnt));

