const React = require('react');
var      cx = require('classnames');
const     $ = require('jquery');
const assert = require('chai').assert;

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import {OverlayTrigger, Tooltip, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';


// REDUX
import { connect }          from 'react-redux';


function enhance(regions) {
  let rv = [];
  for (let i = 0 ; i < regions.length ; i++) {
    console.log(regions[i]);
    rv.push(Object.assign({}, regions[i], {enabled: true}));
  }
  return rv
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    regions: enhance(state.regions.val)
    , state: state.regions.state
  };
};


class RegionList extends React.Component {

  constructor(props) {
    super(props);
    this.outerDivRef = React.createRef();
    this.agGridRef    = React.createRef();
    this.state = {fitOption: 'fit', width: 100};
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    this.applyFit();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const width = $(this.outerDivRef.current).width();
    console.log(`width of element is ${width}`);
    this.setState({width});
  }

  sizeToFit = ()=> {
    console.log(`sizeColumnsToFit`);
    this.gridApi.sizeColumnsToFit();
  }

  handleChange = (v) => {
    console.log(v);
    this.setState({fitOption: v});
  }

  componentDidUpdate = (prevProps, prevState) => {
    if ((prevState.fitOption != this.state.fitOption) || (prevState.width != this.state.width)) {
      this.applyFit();
    }
  }

  applyFit = () => {
    const _applyFit = () => {
      switch (this.state.fitOption) {
        case 'fit':
          this.sizeToFit();
          break;
        case 'auto':
          this.autoSizeAll(false);
          break;
        default:
          throw `unrecognized fit option: [${this.state.fitOption}]`;
      }
    };
    
    if ((this.gridApi != null) && (this.columnApi != null))
      _applyFit();
    else {
      const intervalId = window.setInterval(()=> {
        console.log('x');
        if ((this.gridApi != null) && (this.columnApi != null)) {
          _applyFit();
          window.clearInterval(intervalId)
        }
      }, 50);
    }
  }



  autoSizeAll = (skipHeader) => {
    console.log(`autoSizeAll`);
    var allColumnIds = [];
    this.columnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.columnApi.autoSizeColumns(allColumnIds, skipHeader);
  }


  onGridReady = (params) => {
    this.gridApi   = params.api;
    this.columnApi = params.columnApi;
  }


  render() {
    const columnDefs = [
      {headerName: "Enabled"
     , field: "enabled"
     , sortable: true
     , filter: true
     , resizable: true
     , type: 'boolean'
        /*
     , cellRenderer: (params) => { 
       const input = document.createElement('input');
       input.type='checkbox';
       input.checked=params.value;
       input.addEventListener('click', function (event) {
         params.value=!params.value;
         params.node.data.enabled = params.value;
       });
       return input;
     }*/}
      , {headerName: "Name", field: "name", sortable: true, filter: true, resizable: true}
      , {headerName: "WKT", field: "wkt", sortable: true, filter: true, resizable: true}];
    switch (this.props.state) {
      case 'fetching':
        return <div>fetching regions &hellip;</div>;
      case 'steady':
        return (
          <div ref={this.outerDivRef}>
            <div>{this.props.regions.length} regions were fetched</div>

            <ToggleButtonGroup type="radio" name='options' defaultValue={this.state.fitOption} onChange={this.handleChange}>
              <ToggleButton value={'fit'}><i className='fas fa-text-width fa-xs'></i></ToggleButton>
              <ToggleButton value={'auto'}><i className='fas fa-ruler-horizontal fa-xs'></i></ToggleButton>
            </ToggleButtonGroup>

            <div className='ag-theme-alpine' style={{ width: '{this.state.width}px', height: '600px'}}>
              <AgGridReact ref={this.agGridRef}
                           onGridReady={this.onGridReady}
                           columnDefs={columnDefs}
                           rowData={this.props.regions}>
              </AgGridReact>
            </div>
          </div>
        );
      default:
        throw `region-list.jsx :: unrecognized state: [${this.props.state}]`;
    }
  }
}

export default connect(mapStateToProps)(RegionList);
