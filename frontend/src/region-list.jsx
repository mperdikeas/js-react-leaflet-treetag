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


import {arr2str} from './region-list-util.jsx';



/*
 * cf. sse-1592215091
 * Map<String, List<Region>>
 * with Region being: <name: String, wkt: String>
 *
 *
 */
function transform(v) {

  function regions(_i, vs) {
    const rv = []
    for (let i = 0; i < vs.length; i++) {
      const v = vs[i];
      const key = `arr2str([_i, i]); // ${_i}-${i}`;
      rv.push({title: v.name
             , value: key
             , key: key});
    }
    return rv;
  }

  const rv = [];

  let i = 0;
  for (let [key, value] of Object.entries(v)) {
    console.log(`${key}: ${value}`);
    const key2 = arr2str([i]);
    rv.push({title: key
           , value: key2
           , key: key2
           , children: regions(i, value)});
    i++;
  }
  return rv;
}

const mapStateToProps = (state) => {
  console.log(state.regions.val);
  return {
    regions: transform(state.regions.val)
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
          treeData: this.props.regions,
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
            <div>{this.props.regions.length} regions were fetched</div>
            <TreeSelect {...tProps} />;
          </>
        );
      default:
        throw `region-list.jsx :: unrecognized state: [${this.props.state}]`;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionList);
