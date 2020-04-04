const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import Map                                     from './map.jsx';
import TreeInformationPanel                    from './information-panel-tree.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import Toolbox                                 from './toolbox.jsx';
import ToastLayer                              from './toast-layer.jsx';
import ModalRoot                               from './modal-root.jsx';
import UserControl                             from './user-control.jsx';

import wrapContexts                            from './context/contexts-wrapper.jsx';

// REDUX
import { connect }          from 'react-redux';
import {changeTileProvider} from './actions/index.js';


const mapStateToProps = (state) => {
  return {
    isTargetSelected: state.targetId !== null
    , modalType: state.modalType
    , maximizedInfoPanel: state.maximizedInfoPanel
  };
};




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

    const headerBarHeight = this.props.geometryContext.geometry.headerBarHeight;
    const containerStyleOverrides = {paddingRight: 0, paddingLeft: 0};
    const gui = (
      <div className='container-fluid' key='main-gui-component' style={containerStyleOverrides}>

        <div className='row no-gutters justify-content-start align-items-center'
             style={{height: `${headerBarHeight}px`}}>
          <div className='col-10'>
            <PointCoordinates/>
          </div>
          <div className='col-2'>
            <UserControl/>
          </div>
        </div>

        <div className=  'row no-gutters'>
          <div className={classesForMapDivValue}>
            <div className='row no-gutters'>
              <div className='col' style={toolboxStyle}>
                <Toolbox/>
              </div>
              <div className='col'>
                <Map tileProviderId={this.props.tileProviderId}/>
              </div>
            </div>
          </div>
          {this.props.isTargetSelected?<TreeInformationPanel/>:null}
        </div>
      </div>
    );


    return (
      <ToastLayer>
      <ModalRoot>
      {gui}
      </ModalRoot>
      </ToastLayer>
    );
  }
}

export default connect(mapStateToProps, null)(wrapContexts(App));

