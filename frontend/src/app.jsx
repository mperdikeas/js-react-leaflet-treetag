const     _ = require('lodash')
const     $ = require('jquery')
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react')
var      cx = require('classnames')

import PropTypes from 'prop-types'

const createReactClass = require('create-react-class')
const assert = require('chai').assert




import TilesSelector            from './tiles-selector.jsx'
import Map                      from './map.jsx'
import InformationPanel         from './information-panel.jsx'
import PointCoordinates         from './point-coordinates.jsx'
import GeometryContextProvider  from './context/geometry-context.jsx'

class App extends React.Component {



  constructor(props) {
    super(props);
    this.state = {
      tileProviderId: 'esri'
      , maximizedInfo: false
      , target: null
      , coords: null
    };
    this.updateCoordinates              = this.updateCoordinates      .bind(this)
    this.onTileProviderSelect           = this.onTileProviderSelect   .bind(this)
    this.updateTarget                   = this.updateTarget           .bind(this)
    this.toggleInfoPanel                = this.toggleInfoPanel        .bind(this)

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

    const informationPanel = (
      <InformationPanel key={this.state.target}
                        target={this.state.target}
                        maximized={this.state.maximizedInfo}
                        toggleInfoPanel={this.toggleInfoPanel}/>

    );

    const classesForMapDiv = Object.assign({'col-8': true, 'padding-0': true}
                                         , {hidden: this.state.maximizedInfo});

    return (
      <GeometryContextProvider>
        <div class='container-fluid'>
          <div class='row no-gutters'>
            <div class={cx(classesForMapDiv)}>
              <div class='row no-gutters justify-content-start align-items-center' style={{height: `${this.context.headerBarHeight}px`}}>
                <div class="col-3">
                  <TilesSelector onTileProviderSelect={this.onTileProviderSelect}/> 
                </div>
                <PointCoordinates coords={this.state.coords}/>
              </div>
              <Map tileProviderId={this.state.tileProviderId}
                   updateTarget={this.updateTarget}
                   updateCoordinates={this.updateCoordinates}
              />
            </div>
            {informationPanel}
          </div>
        </div>
      </GeometryContextProvider>
    );
  }

}



export default App;

