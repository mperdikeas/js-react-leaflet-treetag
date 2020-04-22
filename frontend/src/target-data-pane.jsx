const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

// REDUX
import { connect }          from 'react-redux';


import {NumericDataFieldFactory, BooleanDataFieldFactory} from './data-field-controls.jsx';

const mapStateToProps = (state) => {
  return {
    targetId: state.targetId
  };
};


class TargetDataPane extends React.Component {

    constructor(props) {
      super(props);
    }

    componentDidMount() {
    }



  handleChange = (fieldName, value) => {
    const newTreeData = {...this.props.treeData, [fieldName]: value};
    this.props.updateTreeData(newTreeData);
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
      assert.exists(this.props.treeData);
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
             comments} = this.props.treeData;
      const NumericDataField = NumericDataFieldFactory(this.handleChange);
      const BooleanDataField = BooleanDataFieldFactory(this.handleChange);
      return (
        <>
        <div>
        Data for tree {this.props.targetId} follow
        </div>
        <Form noValidate onSubmit={this.handleSubmit}>

        <NumericDataField name='yearPlanted' label='έτος φύτευσης' value={yearPlanted} />


          <Form.Group as={Row} controlId="healthStatus">
            <Form.Label column sm='8'>Υγεία</Form.Label>
            <Col sm='4'>
              <Form.Group controlId="healthStatus">
                <Form.Control as="select"
                        ref={this.healthStatus}
                        required
                        name="healthStatus"
                        value={healthStatus}
                        onChange={(ev)=>this.handleChange(ev.target.name, ev.target.value)}
                >
                  <option value='-1'>poor</option>
                  <option value='0'>normal</option>
                  <option value='1'>good</option>
                </Form.Control>
              </Form.Group>
            </Col>
        </Form.Group>

        <NumericDataField name='heightCm'            label='Ύψος (cm)'              value={heightCm} />
        <NumericDataField name='crownHeightCm'       label='Έναρξη κόμης (cm)'      value={crownHeightCm} />

        <NumericDataField name='circumferenceCm'     label='Περιφέρεια (cm)'        value={circumferenceCm} />

        <BooleanDataField name='raisedSidewalk'      label='Ανασηκωμένο πεζοδρόμιο' value={raisedSidewalk}/>
        <BooleanDataField name='powerlineProximity'  label='Εγγύτητα σε ΔΕΗ'        value={powerlineProximity}/>
        <BooleanDataField name='obstruction'         label='Εμποδίζει διεύλευση'    value={obstruction}/>
        <BooleanDataField name='debris'              label='Θραύσματα'              value={debris}/>
        <BooleanDataField name='litter'              label='σκουπίδια'              value={litter}/>
        <BooleanDataField name='trunkDamage'         label='πληγώσεις'              value={trunkDamage}/>
        <BooleanDataField name='fallHazard'          label='κίνδυνος πτώσης'        value={fallHazard}/>
        <BooleanDataField name='publicInterest'      label='δημοσίου ενδιαφέροντος' value={publicInterest}/>
        <BooleanDataField name='disease'             label='ασθένεια'               value={disease}/>        
          <Form.Group as={Row} controlId="comments">
            <Form.Label column sm='4'>Σχόλια</Form.Label>
            <Col sm='8'>
              <Form.Control
                        as='textarea'
                        rows='5'
                        ref={this.comments}
                        required
                        type="number"
                        name="comments"
                        value={comments}
                        onChange={(ev)=>this.handleChange(ev.target.name, ev.target.value)}
              />
            </Col>
          </Form.Group>
          
          
        </Form>




        </>
      );
    }
  }
}


export default connect(mapStateToProps)(TargetDataPane);


