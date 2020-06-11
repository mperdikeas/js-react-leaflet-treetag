const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import RegionMgmntMap                          from './region-mgmnt-map.jsx';
import RegionList                              from './region-list.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import UserControl                             from './user-control.jsx';

import wrapContexts                            from './context/contexts-wrapper.jsx';

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



  render() {
    const headerBarHeight = this.props.geometryContext.geometry.headerBarHeight;
    return (
      <div className='container-fluid' key='main-gui-component' style={{paddingRight: 0, paddingLeft: 0}}>

        <div className='row no-gutters justify-content-start align-items-center'
             style={{height: `${headerBarHeight}px`}}>
          <div className='col-5'>
            <PointCoordinates/>
          </div>
          <div className='col-7'>
            <UserControl/>
          </div>
        </div>

        <div className='row no-gutters'>
          <div className={cx({'col-8': true, 'padding-0': true})}>

            <RegionMgmntMap/>

          </div>
          <div className={cx({'col-4':true})} style={{background: 'red'}}>

            <RegionList/>
            
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(wrapContexts(RegionMgmnt));

