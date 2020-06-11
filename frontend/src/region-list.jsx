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

const mapStateToProps = (state) => {
  return {
    regions: state.regions.regions
    , state: state.regions.state
  };
};


class RegionList extends React.Component {

  constructor(props) {
    super(props);
    this.outerDivRef = React.createRef();
    this.agGridRef    = React.createRef();
    this.state = {
      fitOption: 'fit',
      width: 100,
      columnDefs: [{
        headerName: "Make", field: "make", sortable: true, filter: true, resizable: true
      }, {
        headerName: "Model", field: "model", sortable: true, filter: true, resizable: true
      }, {
        headerName: "Price", field: "price", sortable: true, filter: true, resizable: true
      }],
      rowData: [{
        make: "Toyota", model: "Celica", price: 35000
      }, {
        make: "Ford", model: "Mondeo", price: 32000
      }, {
        make: "Porsche", model: "Boxter", price: 72000
      }]
    }
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
                           columnDefs={this.state.columnDefs}
                           rowData={this.state.rowData}>
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
