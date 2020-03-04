const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

import PropTypes from 'prop-types';

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import TilesSelector            from './tiles-selector.jsx';
import Map                      from './map.jsx';
import InformationPanel         from './information-panel.jsx';
import PointCoordinates         from './point-coordinates.jsx';
import Toolbox                  from './toolbox.jsx';

class App extends React.Component {


  static contextType = GeometryContext
  
  constructor(props) {
    super(props);
    this.state = {
      tileProviderId: 'esri'
      , maximizedInfo: false
      , target: null
      , coords: null
      , selectedTool: null
    };
  }

  updateSelectedTool = (selectedTool) => {
    console.log(selectedTool);
    if (selectedTool===this.state.selectedTool)
      this.setState({selectedTool: null});
    else
      this.setState({selectedTool});
  }

  
  

  updateCoordinates = (coords) => {
    this.setState({coords: coords});
  }

  onTileProviderSelect = (tileProviderId) => {
    this.setState({tileProviderId :tileProviderId});
  }

  updateTarget = (targetId) => {
    console.log(`app::updateTarget(${targetId}}`);
    this.setState({target: {targetId}});
  }

  toggleInfoPanel = () => {
    this.setState({maximizedInfo: !this.state.maximizedInfo});
  }

  render() {
    console.log('app::render()', this.context);

    const informationPanel = (
      <InformationPanel key={this.state.target}
                        target={this.state.target}
                        maximized={this.state.maximizedInfo}
                        toggleInfoPanel={this.toggleInfoPanel}/>

    );

    const classesForMapDiv = Object.assign({'col-8': true, 'padding-0': true}
                                         , {hidden: this.state.maximizedInfo});

    const toolboxStyle = {flex: `0 0 ${this.context.toolboxTotalWidth()}px`
                        , backgroundColor: 'green'};
    return (
      <div class='container-fluid'>
        <div class='row no-gutters'>
          <div class={cx(classesForMapDiv)}>
            <div class='row no-gutters justify-content-start align-items-center'
                 style={{height: `${this.context.headerBarHeight}px`}}>
              <div class="col-3">
                <TilesSelector onTileProviderSelect={this.onTileProviderSelect}/> 
              </div>
              <PointCoordinates coords={this.state.coords}/>
            </div>
            <div class='row no-gutters'>
              <div class='col' style={toolboxStyle}>
                <Toolbox
                    selectedTool={this.state.selectedTool}            
                    updateSelectedTool = {this.updateSelectedTool}/>
              </div>
              <div class='col'>
                <Map tileProviderId={this.state.tileProviderId}
                     updateTarget={this.updateTarget}
                     updateCoordinates={this.updateCoordinates}
                     selectedTool={this.state.selectedTool}
                />
              </div>
            </div>
          </div>
          {informationPanel}
        </div>
      </div>
    );
  }

}



export default App;

