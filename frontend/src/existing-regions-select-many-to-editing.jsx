const React = require('react');

import chai from './util/chai-util.js';
const assert = chai.assert;



import { TreeSelect } from 'antd';

import { connect }          from 'react-redux';

import wrapContexts            from './context/contexts-wrapper.jsx';
import {updateSelectedRegions} from './redux/actions/index.js';
import {existingRegionsAsAntdTreeControlData}   from './redux/selectors/index.js';


const mapStateToProps = (state) => {
  return {
    existingRegionsAsAntdTreeControlData: existingRegionsAsAntdTreeControlData(state)
    , selected: state.regions.editing.selected
  };
};



const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedRegions: (selectedRegions)=>dispatch(updateSelectedRegions(selectedRegions))
  };
};

class ExistingRegionsSelectManyToEditing extends React.Component {

  constructor(props) {
    super(props);
  }
  

  render = () => {
    const tProps = {
      treeData: this.props.existingRegionsAsAntdTreeControlData,
      value: this.props.selected,
      onChange: this.props.updateSelectedRegions,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
      placeholder: 'Please select',
      style: {
        width: '100%',
        height: `${this.props.geometryContext.screen.height*0.3}px`
      }
    };
    return (
      <TreeSelect {...tProps} />
      );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ExistingRegionsSelectManyToEditing));
