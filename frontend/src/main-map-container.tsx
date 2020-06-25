import React from 'react';
var      cx = require('classnames');

import Map                                     from './map.jsx';
import TreeInformationPanel                    from './information-panel-tree.jsx';
import PointCoordinates                        from './point-coordinates.tsx';
import Toolbox                                 from './toolbox.jsx';
import ToastsStack                             from './components/toasts/toasts-stack.jsx';
import ModalRoot                               from './modal-root.jsx';
import UserControl                             from './user-control.jsx';

import wrapContexts                            from './context/contexts-wrapper.tsx';

// REDUX
import { connect }          from 'react-redux';

import NavLinkToLanding from './navlink-to-landing.jsx';

import {IStore} from './redux/types.ts';


type Props = {
  isTargetSelected: boolean
  , maximizedInfoPanel: boolean
}

const mapStateToProps = (state: IStore):Props => {
  return {
    isTargetSelected: state.target.id != null
    , maximizedInfoPanel: state.maximizedInfoPanel
  };
};




class MainMapContainer extends React.Component<Props, any> {


  constructor(props: {isTargetSelected: boolean, maximizedInfoPanel: boolean}) {
    super(props);
  }



  render() {
    const classesForMapDiv = Object.assign({'col-8': this.props.isTargetSelected
                                            , 'col-12': !this.props.isTargetSelected
                                          , 'padding-0': true}
                                         , {hidden: this.props.maximizedInfoPanel});
    const classesForMapDivValue = cx(classesForMapDiv);
    console.log(`classes are ${classesForMapDivValue}`);
    
    const toolboxStyle = {flex: `0 0 ${(this.props as any).geometryContext.toolboxTotalWidth()}px`
                        , backgroundColor: 'green'};

    const headerBarHeight = (this.props as any).geometryContext.geometry.headerBarHeight;
    const containerStyleOverrides = {paddingRight: 0, paddingLeft: 0};
    const gui = (
      <div className='container-fluid' key='main-gui-component' style={containerStyleOverrides}>

        <div className='row no-gutters justify-content-start align-items-center'
             style={{height: `${headerBarHeight}px`}}>
          <div className='col-4'>


            
            <PointCoordinates/>
          </div>
          <div className='col-4'>
            <NavLinkToLanding/>
          </div>
          <div className='col-4'>
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
                <Map/>
              </div>
            </div>
          </div>
          {this.props.isTargetSelected?<TreeInformationPanel/>:null}
        </div>
      </div>
    );


    return gui;

  }
}

export default connect(mapStateToProps, null)(wrapContexts(MainMapContainer));

