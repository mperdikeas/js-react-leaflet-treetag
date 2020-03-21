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
import {BASE_URL}                              from './constants.js';
import {setCookie}                             from './util.js';
import wrapContexts                            from './context/contexts-wrapper.jsx';
import {SELECT_TREE, DEFINE_POLYGON, ADD_BEACON, SELECT_GEOMETRY} from './constants/modes.js';

// redux
import { connect }          from 'react-redux';
import {changeTileProvider} from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    tileProviderId: state.tileProviderId
    , mode: state.mode
    , modalType: state.modalType
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
    this.state = {
        maximizedInfo: false
      , target: null
      , logErrMsg: null
    };
  }

/*
  addPointToPolygonUnderConstruction = ({lat, lng})=>{
    this.setState({geometryUnderDefinition: [...this.state.geometryUnderDefinition, {lat, lng}]});
  }
  */
/*
  updateSelectedTool = (mode) => {
    if (mode===this.state.mode) {
      if (mode === DEFINE_POLYGON_TOOL) {
        console.log('case A');
        this.setState({deleteGeometryUnderDefinition: this.state.geometryUnderDefinition.length>0
                     , mode: null
                     , geometryUnderDefinition: []});
      } else {
        console.log('case B');
        this.setState({deleteGeometryUnderDefinition: false, mode: null});
      }
    } else
    this.setState({mode, deleteGeometryUnderDefinition: false});
  }

  clearDeleteGeometryUnderDefinition = ()=>{
    this.setState({deleteGeometryUnderDefinition:false});
    }

  updateCoordinates = (coords) => {
    this.setState({coords: coords});
  }
*/
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
    /*
                <Toolbox
                    mode={this.state.mode}            
                    updateSelectedTool = {this.updateSelectedTool}
                    geometryUnderDefinition={this.state.geometryUnderDefinition.length>0}
                />
    */
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
                <Map tileProviderId={this.props.tileProviderId}
                     updateTarget={this.updateTarget}
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
          modalType   = {this.props.modalType}
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

console.log('app.jsx EXITING');
