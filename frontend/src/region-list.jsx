const React = require('react');
var      cx = require('classnames');
const     $ = require('jquery');
const assert = require('chai').assert;

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'antd/dist/antd.css';

import { TreeSelect } from 'antd';


// REDUX
import { connect }          from 'react-redux';

import {updateSelectedRegions} from './redux/actions/index.js';
import {antdTreeControlData}   from './redux/selectors/index.js';




const mapStateToProps = (state) => {
  console.log(state.regions.val);
  return {
    antdTreeControlData: antdTreeControlData(state)
    , selected: state.regions.selected
    , state: state.regions.state
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedRegions: (selectedRegions)=>dispatch(updateSelectedRegions(selectedRegions))
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
            height: '800px'
          }
        };
        return (
          <>
            <TreeSelect {...tProps} />;
          </>
        );
      default:
        throw `region-list.jsx :: unrecognized state: [${this.props.state}]`;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionList);
