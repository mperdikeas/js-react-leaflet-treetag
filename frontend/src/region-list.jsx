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


function transform(v) {

  function regions(_i, vs) {
    const rv = []
    for (let i = 0; i < vs.length; i++) {
      const v = vs[i];
      const key = `${_i}-${i}`;
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
    const key2 = `${i}`;
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
    , state: state.regions.state
  };
};


class RegionList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: ['1-1', '1-3']
    };
  }

  onChange = (v) => {
    console.log(v);
    this.setState({selected: v});
  }

  render() {
    switch (this.props.state) {
      case 'fetching':
        return <div>fetching regions &hellip;</div>;
      case 'steady':
        const tProps = {
          treeData: this.props.regions,
          value: this.state.selected,
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

export default connect(mapStateToProps)(RegionList);

