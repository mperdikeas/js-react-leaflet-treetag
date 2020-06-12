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

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
];

const mapStateToProps = (state) => {
  console.log(state);
  return {
    regions2: state.regions.val
    , regions: treeData
    , state: state.regions.state
  };
};


class RegionList extends React.Component {

  constructor(props) {
    super(props);
    this.outerDivRef = React.createRef();
    console.log(`cxc 3: regions are: ${this.props.regions}`);
    this.state = {
      selected: ['1-1', '1-3']
    };
  }

  
  static getDerivedStateFromPropsUNUSED(nextProps, prevState){
    console.log('cxc 1');
    if(nextProps.regions!==prevState.regions) {
      console.log('cxc 2', prevState);
      const rv =  Object.assign({}
                              , prevState
                              , {enableds: trueArray(nextProps.regions)});
      console.log(`cxc 4`, rv);
      return rv;
    }
    else return null;
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const width = $(this.outerDivRef.current).width();
    console.log(`width of element is ${width}`);
    this.setState({width});
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
          treeData,
          value: this.state.selected,
          onChange: this.onChange,
          treeCheckable: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          placeholder: 'Please select',
          style: {
            width: '100%',
          },
        };
        return (
          <div ref={this.outerDivRef}>
            <div>{this.props.regions.length} regions were fetched</div>
            {/*            <div style={{ width: '{this.state.width}px', height: '600px'}}> */}
              <div style={{ width: '{this.state.width}px', height: '650px'}}>
                <TreeSelect {...tProps} />;
            </div>
          </div>
        );
      default:
        throw `region-list.jsx :: unrecognized state: [${this.props.state}]`;
    }
  }
}

export default connect(mapStateToProps)(RegionList);

