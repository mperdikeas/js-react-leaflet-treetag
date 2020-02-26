const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const createReactClass = require('create-react-class');
const assert = require('chai').assert;





import Map        from './map.jsx';
import {BaseLayers, BaseLayersForLayerControl} from './baseLayers.js';
import InformationPanel from './information-panel.jsx';
import PointCoordinates from './point-coordinates.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tileProviderId: 'esri'
      , maximizedInfo: false
      , target: null
      , coords: null
    };
    this.updateCoordinates              = this.updateCoordinates   .bind(this);
    this.onTileProviderSelect           = this.onTileProviderSelect.bind(this);
    this.updateTarget                   = this.updateTarget        .bind(this);
    this.toggleInfoPanel = this.toggleInfoPanel.bind(this);
  }

  componentDidMount() {
  }
  
  componentDidUpdate(prevProps, prevState) {
  }

  updateCoordinates(coords) {
    this.setState({coords: coords});
  }

  onTileProviderSelect(tileProviderId) {
    this.setState({tileProviderId :tileProviderId});
  }

  updateTarget(targetId) {
    console.log(`app::updateTarget(${targetId}}`);
    this.setState({target: {targetId}});
  }

  toggleInfoPanel() {
    this.setState({maximizedInfo: !this.state.maximizedInfo});
  }

  render() {
    console.log('app::render()');
    const options = [];
    for (let x in BaseLayers) {
      console.log('for x in BaseLayers', x);
      options.push(
        <a class="dropdown-item" onClick={()=>this.onTileProviderSelect(x)}>
          {BaseLayers[x].friendlyName}
        </a>
      );
    }
    const dropDownMenu = (
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {options}
      </div>
    );
    if (this.state.maximizedInfo)
      return (
        <div class='container-fluid'>
          <div class='row no-gutters'>
            <div class='col-12 padding-0'>
              <InformationPanel target={this.state.target} toggleInfoPanel={this.toggleInfoPanel}/>
            </div>
          </div>
        </div>
      )
    else return (
      <div class='container-fluid'>
        <div class='row no-gutters'>
          <div class='col-8 padding-0'>
            <div class='row no-gutters justify-content-start align-items-center' style={{height: '50px'}}>
              <div class="dropdown col-3">
                <button class="btn btn-primary dropdown-toggle"
                        type="button" id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                  Tiles provider
                </button>
                {dropDownMenu}
              </div>
              <PointCoordinates coords={this.state.coords}/>
            </div>
            <Map tileProviderId={this.state.tileProviderId}
                 updateTarget={this.updateTarget}
                 updateCoordinates={this.updateCoordinates}
            />
          </div>
          <InformationPanel target={this.state.target} toggleInfoPanel={this.toggleInfoPanel}/>
        </div>
      </div>
    );
  }
}



export default App;

