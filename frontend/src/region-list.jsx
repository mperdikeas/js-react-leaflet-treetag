const React = require('react');
var      cx = require('classnames');
const     $ = require('jquery');
const assert = require('chai').assert;

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


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
    this.gridApi.sizeColumnsToFit();
  }

  autoSizeAll = (skipHeader) => {
    var allColumnIds = [];
    console.log(this.agGridRef.current.api);
    console.log('------------------------');
    console.log(this.agGridRef.current.columnApi);
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
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <button style={{fontSize: '85%'}}onClick={this.sizeToFit}>Size to Fit</button>
              <button style={{fontSize: '85%'}}onClick={()=>this.autoSizeAll(false)}>Auto-Size</button>
            </div>
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
