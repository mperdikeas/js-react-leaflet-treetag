const React = require('react');
var      cx = require('classnames');


import chai from './util/chai-util.js';
const assert = chai.assert;

import {Nav} from 'react-bootstrap';
import { TreeSelect, Radio, Button } from 'antd';

import RegionMgmntMap                          from './region-mgmnt-map.jsx';
import RegionList                              from './region-list.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import UserControl                             from './user-control.jsx';

import wrapContexts                            from './context/contexts-wrapper.tsx';

import {LANDING_PAGE} from './constants/navig-constants.js';


// REDUX
import { connect }          from 'react-redux';

import { withRouter } from 'react-router-dom'

import {isRegionsBeingFetched
      , existingRegionsAsAntdTreeControlData
      , rgeMode
      , partitions
      , rgmgmntSaveEnabled
      , rgmgmntDuringDeletion
      , wktRegionUnderConstructionExists}   from './redux/selectors/index.js';

import {getRegions} from './redux/actions/index.js';

import NavLinkToLanding from './navlink-to-landing.jsx';


const mapStateToProps = (state) => {
  return {
    isRegionsBeingFetched: isRegionsBeingFetched(state)
    , selectedRegion: state.regions.overlaps.regions
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getRegions: ()=>dispatch(getRegions())
  };
};


import ExistingRegionsSelectManyToEditing from './existing-regions-select-many-to-editing.jsx';


class RegionOverlaps extends React.Component {


  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.isRegionsBeingFetched)
      this.props.getRegions();
  }

  propsForRegionSelectionTree() {
    return  {
      value: this.props.selectedRegion,
      onChange: this.props.updateSelectedRegions,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      placeholder: 'Select region for overlap computation',
      styleDD: {
        width: '100%',
        height: `${this.props.geometryContext.screen.height*0.3}px`
      }
    }
  }

  render() {
    const headerBarHeight = this.props.geometryContext.geometry.headerBarHeight;
    return (
      <div className='container-fluid' key='main-gui-component' style={{paddingRight: 0, paddingLeft: 0}}>
        <div className='row no-gutters justify-content-start align-items-center'
             style={{height: `${headerBarHeight}px`}}>


          <div className = 'col-8'>
            <NavLinkToLanding/>
            </div>
          <div className='col-4'>
            <UserControl/>
          </div>
        </div>
        <div className='row no-gutters'>
          <div className={cx({'col-6': true, 'padding-0': true})}>
            {this.props.isRegionsBeingFetched?
             <span>fetching regions...</span>:
             <ExistingRegionsSelectManyToEditing/>
            }
          </div>
          <div className={cx({'col-6': true, 'padding-0': true})}>
            select partitions
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

