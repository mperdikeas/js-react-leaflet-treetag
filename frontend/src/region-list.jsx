const React = require('react');
var      cx = require('classnames');
const     $ = require('jquery');
const assert = require('chai').assert;

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'antd/dist/antd.css';
import { v4 as uuidv4 } from 'uuid';
import { TreeSelect } from 'antd';

import {Form, Col, Row, Button, Nav, ButtonGroup} from 'react-bootstrap';
// REDUX
import { connect }          from 'react-redux';

import {updateSelectedRegions, displayModal, setRGEMode} from './redux/actions/index.js';
import {antdTreeControlData}   from './redux/selectors/index.js';

import wrapContexts            from './context/contexts-wrapper.jsx';

import {MDL_NOTIFICATION, MDL_NOTIFICATION_NO_DISMISS} from './constants/modal-types.js';

import {RGE_MODE} from './redux/reducers/editingRegionsReducer.js';


const mapStateToProps = (state) => {
  console.log(state.regions.val);
  return {
    antdTreeControlData: antdTreeControlData(state)
    , selected: state.regions.existing.selected
    , state: state.regions.existing.state
    , rgeEditingMode: state.regions.editing.mode
    , buttonsEnabled: state.regions.editing.mode!=RGE_MODE.UNENGAGED
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedRegions: (selectedRegions)=>dispatch(updateSelectedRegions(selectedRegions))
    , displayNotification  : (html)=>dispatch(displayModal(MDL_NOTIFICATION, {html, uuid: uuidv4()}))
    , setRGEMode: (mode)=>dispatch(setRGEMode(mode))
  };
};



class RegionList extends React.Component {

  constructor(props) {
    super(props);
  }

  onChange = (v) => {
    console.log(v);
    this.props.updateSelectedRegions(v);
  }

  startCreating = ()=>{
    this.props.displayNotification('use the control in the left to create a new region');
    this.props.setRGEMode(RGE_MODE.CREATING);
  }

  startModifying = ()=>{
    this.props.displayNotification('click on a region to begin editing');
    this.props.setRGEMode(RGE_MODE.MODIFYING);
  }
    

  render() {
    switch (this.props.state) {
      case 'fetching':
        return <div>fetching regions &hellip;</div>;
      case 'steady':
        const tProps = {
          treeData: this.props.antdTreeControlData,
          value: this.props.selected,
          onChange: this.onChange,
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
          </div>
        );
      default:
        throw `region-list.jsx :: unrecognized state: [${this.props.state}]`;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(RegionList));
