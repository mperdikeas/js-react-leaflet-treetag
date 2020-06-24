const React = require('react');

import chai from './util/chai-util.js';
const assert = chai.assert;



import { TreeSelect } from 'antd';

import { connect }          from 'react-redux';

import wrapContexts            from './context/contexts-wrapper.tsx';
import {overlapsUpdateSelectedRegion} from './redux/actions/index.ts';
import {existingRegionsAsAntdTreeControlData}   from './redux/selectors/index.js';


const mapStateToProps = (state) => {
  return {
    existingRegionsAsAntdTreeControlData: existingRegionsAsAntdTreeControlData(state)
    , selected: state.regions.editing.selected
  };
};



const mapDispatchToProps = (dispatch) => {
  return {
    overlapsUpdateSelectedRegion: (selectedRegion) => dispatch(overlapsUpdateSelectedRegion(selectedRegion))
  };
};

class ExistingRegionsSelectOneToOverlaps extends React.Component {

  constructor(props) {
    super(props);
  }
  

  render = () => {
    const tProps = {
      treeData: this.props.existingRegionsAsAntdTreeControlData,
      value: this.props.selected,
      onChange: this.props.overlapsUpdateSelectedRegion,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      placeholder: 'Please select',
      style: {
        width: '100%',
        height_NOT_USED_ANY_MORE: `${this.props.geometryContext.screen.height*0.3}px`
      }
    };
    return (
      <TreeSelect {...tProps} />
      );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ExistingRegionsSelectOneToOverlaps));
