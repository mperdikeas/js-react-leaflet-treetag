const React = require('react');
var      cx = require('classnames');
const     $ = require('jquery');
const assert = require('chai').assert;

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'antd/dist/antd.css';
import { TreeSelect, Radio, Button } from 'antd';

import { v4 as uuidv4 } from 'uuid';

//import {Form, Col, Row, Button, Nav, ButtonGroup} from 'react-bootstrap';
// REDUX
import { connect }          from 'react-redux';

import {updateSelectedRegions
      , displayModalNotification, setRGEMode
      , displayModalNewRegionDefinition} from './redux/actions/index.js';
import {antdTreeControlData
      , rgeMode
      , partitions
      , rgmgmntSaveEnabled}   from './redux/selectors/index.js';
import {RGE_MODE}   from './redux/constants/region-editing-mode.js';

import wrapContexts            from './context/contexts-wrapper.jsx';

import {MDL_NOTIFICATION, MDL_NOTIFICATION_NO_DISMISS} from './constants/modal-types.js';


const mapStateToProps = (state) => {
  return {
    antdTreeControlData: antdTreeControlData(state)
    , selected: state.regions.existing.selected
    , state: state.regions.existing.state
    , rgeMode: rgeMode(state)
    , buttonsEnabled: rgeMode(state)!=RGE_MODE.UNENGAGED
    , partitions: partitions(state)
    , rgmgmntSaveEnabled: rgmgmntSaveEnabled(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedRegions: (selectedRegions)=>dispatch(updateSelectedRegions(selectedRegions))
    , displayNotification  : (html)=>dispatch(displayModalNotification({html}))
    , displayNewRegionDefinition  : (uuid, partitions)=>dispatch(displayModalNewRegionDefinition(uuid, partitions))
    , setRGEMode: (mode)=>dispatch(setRGEMode(mode))
  };
};



class RegionList extends React.Component {

  constructor(props) {
    super(props);
  }

  startCreating = ()=>{
    this.props.displayNotification('use the control in the left to create a new region');
    this.props.setRGEMode(RGE_MODE.CREATING);
  }

  startModifying = ()=>{
    this.props.displayNotification('click on a region to begin editing');
    this.props.setRGEMode(RGE_MODE.MODIFYING);
  }

  onChange = (value)=> {
    console.log(`XXX onChange(${JSON.stringify(value)})`);
    switch (value) {
      case RGE_MODE.CREATING:
        this.startCreating()
        break;
      case RGE_MODE.MODIFYING:
        this.startModifying();
        break;
      case RGE_MODE.UNENGAGED:
        this.props.setRGEMode(RGE_MODE.UNENGAGED);
        break;
      default:
        assert.fail(`region-list.jsx::onChange unhandled value: [${value}]`);
    }
  }

  saveRegion = () => {
    console.log('save region');
    this.props.displayNewRegionDefinition(uuidv4(), this.props.partitions);
  }

  render = () => {
    const modeControls = (()=>{
      switch (this.props.rgeMode) {
        case RGE_MODE.UNENGAGED:
          return null;
        case RGE_MODE.MODIFYING:
          return null;
        case RGE_MODE.CREATING:
          return (<div style={{display: 'flex', justifyContent: 'center'}}>
            <Button style={{width: '13em'}} type='primary'
            onClick={this.saveRegion}
            disabled={!this.props.rgmgmntSaveEnabled}
            >save region</Button>
            </div>
          );
      }
    })();
    switch (this.props.state) {
      case 'fetching':
        return <div>fetching regions &hellip;</div>;
      case 'steady':
        const tProps = {
          treeData: this.props.antdTreeControlData,
          value: this.props.selected,
          onChange: this.props.updateSelectedRegions,
          treeCheckable: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          placeholder: 'Please select',
          style: {
            width: '100%',
            height: `${this.props.geometryContext.screen.height*0.3}px`
          }
        };
        return (
          <div style={{height: '100%'
                     , display: 'flex'
                     , flexDirection: 'column'
                     , justifyContent: 'space-between'}}>
            <TreeSelect {...tProps} />;

          {modeControls}

          <Radio.Group style={{marginBottom: '1em'
                             , display: 'flex'
                             , flexDirection: 'row'
                             , justifyContent: 'space-around'}}
                       onChange={(e)=>this.onChange(e.target.value)} valueR={this.props.rgeMode}>
            <Radio.Button value={RGE_MODE.UNENGAGED}>View</Radio.Button>
            <Radio.Button value={RGE_MODE.CREATING}>Create</Radio.Button>
            <Radio.Button value={RGE_MODE.MODIFYING}>Modify</Radio.Button>
          </Radio.Group>

          {/*
          <ButtonGroup style={{marginTop: '1em'
                             , display: 'flex'
                             , flexDirection: 'row'
                             , justifyContent: 'space-around'}}className="mb-2">
            <Button disabled={this.props.buttonsEnabled} style={{flexGrow: 0}} variant="primary" onClick={this.startCreating}>
              New region
            </Button>
            <Button disabled={this.props.buttonsEnabled} style={{flexGrow: 0}} variant="primary" onClick={this.startModifying}>
              Modify region
            </Button>
          </ButtonGroup>
          */}
          </div>
        );
      default:
        throw `region-list.jsx :: unrecognized state: [${this.props.state}]`;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(RegionList));
