const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import TilesSelector                           from './tiles-selector.jsx';
import Map                                     from './map.jsx';
import TreeInformationPanel                    from './information-panel-tree.jsx';
import InformationPanelGeometryDefinition      from './information-panel-geometry-definition.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import Toolbox                                 from './toolbox.jsx';
import {SELECT_TREE_TOOL, DEFINE_POLYGON_TOOL} from './map-tools.js';
import ModalDialog                             from './modal-dialog.jsx';
import UserControl                             from './user-control.jsx';

import {setCookie}                             from './util.js';
import wrapContexts                            from './context/contexts-wrapper.jsx';
import {SELECT_TREE, DEFINE_POLYGON, ADD_BEACON, SELECT_GEOMETRY} from './constants/modes.js';

// REDUX
import { connect }          from 'react-redux';
import {changeTileProvider} from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    tileProviderId: state.tileProviderId
    , mode: state.mode
    , modalType: state.modalType
    , maximizedInfoPanel: state.maximizedInfoPanel
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTileProviderSelect : (tileProviderId) => dispatch(changeTileProvider(tileProviderId))
    };
  }



class App extends React.Component {


  constructor(props) {
    super(props);
  }



  render() {
    const classesForMapDiv = Object.assign({'col-8': true, 'padding-0': true}
                                         , {hidden: this.props.maximizedInfoPanel});

    const toolboxStyle = {flex: `0 0 ${this.props.geometryContext.toolboxTotalWidth()}px`
                        , backgroundColor: 'green'};

    const gui = (
      <div className='container-fluid' key='main-gui-component'>
        <div className='row no-gutters'>
          <div className={cx(classesForMapDiv)}>
            <div className='row no-gutters justify-content-start align-items-center'
                 style={{height: `${this.props.geometryContext.headerBarHeight}px`}}>
              <div className="col-3">
                <TilesSelector onTileProviderSelect={this.props.onTileProviderSelect}/> 
              </div>
              <div className='col-7'>
                <PointCoordinates/>
              </div>
              <div className='col-2'>
                <UserControl/>
              </div>
            </div>
            <div className='row no-gutters'>
              <div className='col' style={toolboxStyle}>
                <Toolbox/>
              </div>
              <div className='col'>
                <Map tileProviderId={this.props.tileProviderId}/>
              </div>
            </div>
          </div>
          {this.informationPanel()}
        </div>
      </div>
    );


    return (
      <ModalDialog>
        {gui}
      </ModalDialog>
    );
  }


  addGeometry = (geometryName) => {
    console.log(`back at the app, with new geometry name: ${geometryName}`);
    const userDefinedGeometriesNew = _.cloneDeep(this.state.userDefinedGeometries);
    userDefinedGeometriesNew.push({name: geometryName
                                 , value: this.state.geometryUnderDefinition});
    this.setState({modalType: null
                 , userDefinedGeometries: userDefinedGeometriesNew
                 , geometryUnderDefinition: []});
  }


  informationPanel = () => {
    const treeInformationPanel = (
      <TreeInformationPanel/>
    );
    switch (this.props.mode) {
      case DEFINE_POLYGON:
        return (
          <InformationPanelGeometryDefinition/>
        );
      case SELECT_TREE:
      default:
        return treeInformationPanel;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(App));

