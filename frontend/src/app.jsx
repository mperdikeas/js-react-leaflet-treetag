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
import ModalRoot                               from './modal-root.jsx';
import UserControl                             from './user-control.jsx';

import {setCookie}                             from './util.js';
import wrapContexts                            from './context/contexts-wrapper.jsx';

// REDUX
import { connect }          from 'react-redux';
import {changeTileProvider} from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    isTargetSelected: state.targetId !== null
    , tileProviderId: state.tileProviderId
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
    const classesForMapDiv = Object.assign({'col-8': this.props.isTargetSelected
                                            , 'col-12': !this.props.isTargetSelected
                                          , 'padding-0': true}
                                         , {hidden: this.props.maximizedInfoPanel});
    const classesForMapDivValue = cx(classesForMapDiv);
    console.log(`classes are ${classesForMapDivValue}`);
    const toolboxStyle = {flex: `0 0 ${this.props.geometryContext.toolboxTotalWidth()}px`
                        , backgroundColor: 'green'};

    const gui = (
      <div className='container-fluid' key='main-gui-component'>
        <div className='row no-gutters'>
          <div className={classesForMapDivValue}>
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
      <ModalRoot>
        {gui}
      </ModalRoot>
    );
  }




  informationPanel = () => {
    const treeInformationPanel = (
      <TreeInformationPanel/>
    );
    if (this.props.isTargetSelected)
      return treeInformationPanel;
    else
      return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(App));

