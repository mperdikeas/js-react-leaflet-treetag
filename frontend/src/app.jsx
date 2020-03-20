console.log('app.jsx ENTERING');
const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import axios from 'axios';

import TilesSelector                           from './tiles-selector.jsx';
import Map                                     from './map.jsx';
import TreeInformationPanel                    from './information-panel-tree.jsx';
import InformationPanelGeometryDefinition      from './information-panel-geometry-definition.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import Toolbox                                 from './toolbox.jsx';
import {SELECT_TREE_TOOL, DEFINE_POLYGON_TOOL} from './map-tools.js';
import ModalDialog                             from './modal-dialog.jsx';
import UserControl                             from './user-control.jsx';
import {geometriesValues, geometriesNames}     from './app-utils.js';
import {BASE_URL}                              from './constants.js';
import {setCookie}                             from './util.js';
import wrapContexts                            from './context/contexts-wrapper.jsx';

// redux
import { connect }          from 'react-redux';
import {changeTileProvider} from './actions/index.js';


const mapStateToProps = (state) => {
  return {tileProviderId: state.tileProviderId};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTileProviderSelect : (tileProviderId) => dispatch(changeTileProvider(tileProviderId))
    };
  }



class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
        maximizedInfo: false
      , target: null
      , coords: null
      , selectedTool: SELECT_TREE_TOOL
      , userDefinedGeometries: []
      , geometryUnderDefinition: []
      , modalType: 'login'
      , logErrMsg: null
    };
  }


  addPointToPolygonUnderConstruction = ({lat, lng})=>{
    this.setState({geometryUnderDefinition: [...this.state.geometryUnderDefinition, {lat, lng}]});
  }
  

  updateSelectedTool = (selectedTool) => {
    if (selectedTool===this.state.selectedTool) {
      if (selectedTool === DEFINE_POLYGON_TOOL) {
        console.log('case A');
        this.setState({deleteGeometryUnderDefinition: this.state.geometryUnderDefinition.length>0
                     , selectedTool: null
                     , geometryUnderDefinition: []});
      } else {
        console.log('case B');
        this.setState({deleteGeometryUnderDefinition: false, selectedTool: null});
      }
    } else
    this.setState({selectedTool, deleteGeometryUnderDefinition: false});
  }

  clearDeleteGeometryUnderDefinition = ()=>{
    this.setState({deleteGeometryUnderDefinition:false});
    }

  updateCoordinates = (coords) => {
    this.setState({coords: coords});
  }

  updateTarget = (targetId) => {
    this.setState({target: {targetId}});
  }

  toggleInfoPanel = () => {
    this.setState({maximizedInfo: !this.state.maximizedInfo});
  }

  render() {
    const classesForMapDiv = Object.assign({'col-8': true, 'padding-0': true}
                                         , {hidden: this.state.maximizedInfo});

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
                <PointCoordinates coords={this.state.coords}/>
              </div>
              <div className='col-2'>
                <UserControl/>
              </div>
            </div>
            <div className='row no-gutters'>
              <div className='col' style={toolboxStyle}>
                <Toolbox
                    selectedTool={this.state.selectedTool}            
                    updateSelectedTool = {this.updateSelectedTool}
                    geometryUnderDefinition={this.state.geometryUnderDefinition.length>0}
                />
              </div>
              <div className='col'>
                <Map tileProviderId={this.props.tileProviderId}
                     updateTarget={this.updateTarget}
                     updateCoordinates={this.updateCoordinates}
                     selectedTool={this.state.selectedTool}
                     userDefinedGeometries={geometriesValues(this.state.userDefinedGeometries)}
                     geometryUnderDefinition={this.state.geometryUnderDefinition}
                     deleteGeometryUnderDefinition={this.state.deleteGeometryUnderDefinition}
                     clearDeleteGeometryUnderDefinition={this.clearDeleteGeometryUnderDefinition}
                     addPointToPolygonUnderConstruction={this.addPointToPolygonUnderConstruction}
                     addPolygon={this.addPolygonDialog}
                />
              </div>
            </div>
          </div>
          {this.informationPanel()}
        </div>
      </div>
    );


    return (
      <ModalDialog
          modalType   = {this.state.modalType}
          modalProps  = {this.createPropertiesForModalType()}
      >
        {gui}
      </ModalDialog>
    );
  }

  createPropertiesForModalType = () => {
    switch (this.state.modalType) {
      case 'geometry-name':
        return {addGeometry: this.addGeometry};
      case 'login':
        return {login: this.login, logErrMsg: this.state.logErrMsg};
      case null:
        return {};
      default:
        assert.fail(`unhandled modal type: ${this.state.modalType}`);
    }
  }

  addPolygonDialog = () => {
    console.log('app::addPolygonDialog');

    this.setState({modalType: 'geometry-name'});

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

  login = (username, password) => {
    const url = `${BASE_URL}/login`;
    axios.post(url, {
      username: username,
      password: password
    }).then(res => {
      if (res.data.err != null) {
        console.log('login API call error');
        assert.fail(res.data.err);
      } else {
        console.log('login API call success');
        if (res.data.t.loginFailureReason===null) {
          setCookie('access_token', res.data.t.accessToken, 0);
          console.log('login was successful and cookie was set');
          this.setState({modalType: null});
          this.props.loginContext.updateLogin(username);
        } else {
          console.log('login was unsuccessful');
          this.setState({logErrMsg: res.data.t.loginFailureReason});
        }
      }
    }).catch( err => {
      console.log(err);
      console.log(JSON.stringify(err));
      assert.fail(err);
    });
  }

  informationPanel = () => {
    const treeInformationPanel = (
      <TreeInformationPanel
          target          = {this.state.target}
          maximized       = {this.state.maximizedInfo}
          toggleInfoPanel = {this.toggleInfoPanel}
      />
    );
    switch (this.state.selectedTool) {
      case DEFINE_POLYGON_TOOL:
        return (
          <InformationPanelGeometryDefinition
              geometriesNames = {geometriesNames(this.state.userDefinedGeometries)}
          />
        );
      case SELECT_TREE_TOOL:
      default:
        return treeInformationPanel;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(App));

console.log('app.jsx EXITING');
