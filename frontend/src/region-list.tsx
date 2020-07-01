import React, {Dispatch} from 'react';

import { connect, ConnectedProps } from 'react-redux';

import chai from './util/chai-util.js';
const assert = chai.assert;



import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import 'antd/dist/antd.css';
import { Radio, Button } from 'antd';

import {ActionSetRGEMode
      , ActionDisplayModalNotification
      , ActionDisplayModalNewRegionDefinition} from './redux/actions/action-types.ts';

import {displayModalNotification, setRGEMode
      , displayModalNewRegionDefinition} from './redux/actions/index.ts';
import {rgeMode
      , partitions
      , rgmgmntSaveEnabled
      , rgmgmntDuringDeletion
      , isRegionsBeingFetched
      , wktRegionUnderConstructionExists}   from './redux/selectors/index.ts';
import {RGE_MODE}   from './redux/constants/region-editing-mode.ts';

import wrapContexts            from './context/contexts-wrapper.tsx';



import ExistingRegionsSelectManyToEditing from './existing-regions-select-many-to-editing.jsx';
import {RootState} from './redux/types.ts';

function viewDisabled(state: RootState) {
  return rgmgmntDuringDeletion(state); // || (rgeMode(state)===RGE_MODE.UNENGAGED);
}

function createDisabled(state: RootState) {
  return rgmgmntDuringDeletion(state); // || (rgeMode(state)===RGE_MODE.CREATING);
}

function modifyDisabled(state: RootState) {
  return rgmgmntDuringDeletion(state); // || (rgeMode(state)===RGE_MODE.MODIFYING);
}

const mapStateToProps = (state: RootState) => {
  return {
    isRegionsBeingFetched: isRegionsBeingFetched(state)
    , rgeMode: rgeMode(state)
    , buttonsEnabled: rgeMode(state)!=RGE_MODE.UNENGAGED
    , partitions: partitions(state)
    , rgmgmntSaveEnabled: rgmgmntSaveEnabled(state)
    , viewDisabled: viewDisabled(state)
    , createDisabled: createDisabled(state)
    , modifyDisabled: modifyDisabled(state)
    , wktRegionUnderConstructionExists: wktRegionUnderConstructionExists(state)
  };
};



const mapDispatchToProps = (dispatch: Dispatch<ActionSetRGEMode | ActionDisplayModalNotification | ActionDisplayModalNewRegionDefinition>) => {
  return {
      displayNotification: (html: string)=>dispatch(displayModalNotification(html))
    , displayNewRegionDefinition: ()=>dispatch(displayModalNewRegionDefinition())
    , setRGEMode: (mode: RGE_MODE)=>dispatch(setRGEMode(mode))
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

class RegionList extends React.Component<PropsFromRedux, {}> {

  constructor(props: PropsFromRedux) {
    super(props);
  }

  startCreating = ()=>{
    this.props.displayNotification('use the control in the left to create a new region');
    this.props.setRGEMode(RGE_MODE.CREATING);
  }

  startModifying = ()=>{
    this.props.displayNotification('click on a region to begin editing');
    this.props.setRGEMode(RGE_MODE.MODIFYING);
  }

  onChange = (value: RGE_MODE)=> {
    const regionUnderCreation = 'a region is being created; to proceed, either save the region or delete it';
    switch (value) {
      case RGE_MODE.CREATING:
        this.startCreating()
        break;
      case RGE_MODE.MODIFYING:
        if (this.props.wktRegionUnderConstructionExists)
          this.props.displayNotification(regionUnderCreation);
        else
          this.startModifying();
        break;
      case RGE_MODE.UNENGAGED:
        if (this.props.wktRegionUnderConstructionExists)
          this.props.displayNotification(regionUnderCreation);
        else
          this.props.setRGEMode(RGE_MODE.UNENGAGED);
        break;
      default:
        assert.fail(`region-list.tsx::onChange unhandled value: [${value}]`);
    }
  }

  saveRegion = () => {
    console.log('save region');
    this.props.displayNewRegionDefinition();
  }

  render = () => {
    const modeControls = (()=>{
      switch (this.props.rgeMode) {
        case RGE_MODE.UNENGAGED:
          return null;
        case RGE_MODE.MODIFYING:
          return null;
        case RGE_MODE.CREATING:
          return (<div style={{display: 'flex', justifyContent: 'center'}}>
            <Button style={{width: '13em'}} type='primary'
                    onClick={this.saveRegion}
                    disabled={!this.props.rgmgmntSaveEnabled}
            >save region</Button>
          </div>
          );
      }
    })();
    if (this.props.isRegionsBeingFetched) {
      return <div>fetching regions &hellip;</div>;
    } else {
      return (
        <div style={{height: '100%'
                   , display: 'flex'
                   , flexDirection: 'column'
                   , justifyContent: 'space-between'}}>
        <ExistingRegionsSelectManyToEditing/>

        {modeControls}

        <Radio.Group style={{marginBottom: '1em'
                          , display: 'flex'
                          , flexDirection: 'row'
                          , justifyContent: 'space-around'}}
                    buttonStyle='solid'
                    onChange={(e: any)=>this.onChange(e.target.value)} value={this.props.rgeMode}>
          <Radio.Button checked={this.props.rgeMode===RGE_MODE.UNENGAGED} disabled={this.props.viewDisabled || (this.props.rgeMode===RGE_MODE.UNENGAGED)} value={RGE_MODE.UNENGAGED}>View</Radio.Button>
          <Radio.Button checked={this.props.rgeMode===RGE_MODE.CREATING} disabled={this.props.createDisabled || (this.props.rgeMode===RGE_MODE.CREATING)} value={RGE_MODE.CREATING}>Create</Radio.Button>
          <Radio.Button checked={this.props.rgeMode===RGE_MODE.MODIFYING} disabled={this.props.modifyDisabled || (this.props.rgeMode===RGE_MODE.MODIFYING)} value={RGE_MODE.MODIFYING}>Modify</Radio.Button>
        </Radio.Group>
        </div>
      );
    }
  } // render
}

export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(RegionList));
