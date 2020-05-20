const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import {Form, Col, Row, Button, Nav, ButtonGroup} from 'react-bootstrap';

// REDUX
import { connect }          from 'react-redux';

import {axiosAuth} from './axios-setup.js';

import {NumericDataFieldFactory
      , BooleanDataFieldFactory
      , SelectDataFieldFactory
      , TextAreaDataFieldFactory} from './data-field-controls.jsx';


import {MODAL_LOGIN, MDL_NOTIFICATION} from './constants/modal-types.js';
import {revertTreeInfo} from './actions/index.js';

const mapStateToProps = (state) => {
  return {
    targetIsDirty: JSON.stringify(state.treeInfo.original)!==JSON.stringify(state.treeInfo.current)
    , targetId: state.targetId
    , treeInfo: state.treeInfo.current
  };
};

const mapDispatchToProps = (dispatch) => {
  const msgInsufPriv1 = 'ο χρήστης δεν έχει τα προνόμια για να εκτελέσει αυτήν την λειτουργία';
  const msgTreeDataHasBeenUpdated = targetId => `τα νέα δεδομένα για το δένδρο #${targetId} αποθηκεύτηκαν`;
  return {
    revertTreeInfo     : (treeInfo) => dispatch(revertTreeInfo     (treeInfo))
  };
}


import wrapContexts from './context/contexts-wrapper.jsx';



class TargetDataPane extends React.Component {

    constructor(props) {
      super(props);
      /* Creating the components here (and not in the render() method) is necessary.
       * See the following for more:
       *
       *    https://stackoverflow.com/a/49688084/274677
       *
       */
      this.NumericDataField  = NumericDataFieldFactory(this.handleChange);
      this.BooleanDataField  = BooleanDataFieldFactory(this.handleChange);
      this.SelectDataField   = SelectDataFieldFactory (this.handleChange);
      this.TextAreaDataField = TextAreaDataFieldFactory(this.handleChange);
    }

    componentDidMount() {
    }



  revert = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.revertTreeInfo();
  }

  handleChange = (fieldName, value) => {
    //    const newTreeData = {...this.props.treeData, [fieldName]: value};
    const newTreeInfo = {...this.props.treeInfo, [fieldName]: value};
    this.props.updateTreeData(newTreeInfo);
  }

  render() {
    if (this.props.userIsLoggingIn) {
      return <div>user is logging in &hellip;</div>;
    }
    else if (this.props.loadingTreeData) {
      return <div>querying the server for tree {this.props.targetId} &hellip;</div>;
    } else if (this.props.error) {
      return (<>
        <div>some shit happened</div>
        <div>JSON.stringify(this.props.error)</div>
        </>
      );
    } else {
      assert.exists(this.props.treeInfo);
      console.log('tree data follows:');
      console.log(this.props.treeInfo);
      console.log('---------------------');
      const {yearPlanted, healthStatus, heightCm,
             crownHeightCm,
             circumferenceCm,
             raisedSidewalk,
             powerlineProximity,
             obstruction,
             debris,
             litter,
             trunkDamage,
             fallHazard,
             publicInterest,
             disease,
             comments} = this.props.treeInfo; //treeData;
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      console.log(this.props.treesConfigurationContext.healthStatuses);
      console.log('============================');
      console.log('saving tree data is: '+this.props.savingTreeData);
      return (
        <>
        <div>
        Data for tree {this.props.targetId} follow
        </div>
        <Form noValidate onSubmit={this.props.handleSubmit}>
          <this.NumericDataField  name='yearPlanted'  label='έτος φύτευσης' value={yearPlanted} />
          <this.SelectDataField   name='healthStatus' label='Υγεία'         value={healthStatus} codeToName={this.props.treesConfigurationContext.healthStatuses}/>
          <this.NumericDataField  name='heightCm'            label='Ύψος (cm)'              value={heightCm} />
          <this.NumericDataField  name='crownHeightCm'       label='Έναρξη κόμης (cm)'      value={crownHeightCm} />
          <this.NumericDataField  name='circumferenceCm'     label='Περιφέρεια (cm)'        value={circumferenceCm} />
          <this.BooleanDataField  name='raisedSidewalk'      label='Ανασηκωμένο πεζοδρόμιο' value={raisedSidewalk}/>
          <this.BooleanDataField  name='powerlineProximity'  label='Εγγύτητα σε ΔΕΗ'        value={powerlineProximity}/>
          <this.BooleanDataField  name='obstruction'         label='Εμποδίζει διεύλευση'    value={obstruction}/>
          <this.BooleanDataField  name='debris'              label='Θραύσματα'              value={debris}/>
          <this.BooleanDataField  name='litter'              label='σκουπίδια'              value={litter}/>
          <this.BooleanDataField  name='trunkDamage'         label='πληγώσεις'              value={trunkDamage}/>
          <this.BooleanDataField  name='fallHazard'          label='κίνδυνος πτώσης'        value={fallHazard}/>
          <this.BooleanDataField  name='publicInterest'      label='δημοσίου ενδιαφέροντος' value={publicInterest}/>
          <this.BooleanDataField  name='disease'             label='ασθένεια'               value={disease}/>
          <this.TextAreaDataField name='comments'            label='Σχόλια'                 value={comments}/>
          <ButtonGroup style={{marginTop: '1em'
                             , display: 'flex'
                             , flexDirection: 'row'
                             , justifyContent: 'space-around'}}className="mb-2">
            <Button disabled={! this.props.targetIsDirty} style={{flexGrow: 0}} variant="secondary" onClick={this.revert}>
              Ανάκληση
            </Button>
            <Button disabled={! this.props.targetIsDirty} style={{flexGrow: 0}} variant="primary" type="submit">
              {this.props.savingTreeData?'Σε εξέλιξη...':'Αποθήκευση'}
            </Button>
          </ButtonGroup>
        </Form>
        </>
      );
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(TargetDataPane));


