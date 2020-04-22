const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

// REDUX
import { connect }          from 'react-redux';

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
      return (
        <>
        <div>
        Data for tree {this.props.targetId} follow
        </div>
        <Form noValidate onSubmit={this.handleSubmit}>

          <Form.Group as={Row} controlId="yearPlanted">
            <Form.Label column sm='8'>Έτος φύτευσης</Form.Label>
            <Col sm='4'>
              <Form.Control
                        ref={this.yearPlanted}
                        required
                        type="number"
                        name="yearPlanted"
                        value={yearPlanted}
                        onChange={(ev)=>this.handleChange(ev.target.name, ev.target.value)}
              />
            </Col>
          </Form.Group>

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

          <Form.Group as={Row} controlId="heightCm">
            <Form.Label column sm='8'>Ύψος (cm)</Form.Label>
            <Col sm='4'>
              <Form.Control
        ref={this.heightCm}
          name="heightCm"
                        required
                        type="number"
                        value={heightCm}
                        onChange={(ev)=>this.handleChange(ev.target.name, ev.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="crownHeightCm">
            <Form.Label column sm='8'>Έναρξη κόμης (cm)</Form.Label>
            <Col sm='4'>
              <Form.Control
          ref={this.crownHeightCm}
          name="crownHeightCm"          
                        required
                        type="number"
                        value={crownHeightCm}
                        onChange={(ev)=>this.handleChange(ev.target.name, ev.target.value)}
              />
            </Col>
          </Form.Group>


          <Form.Group as={Row} controlId="circumferenceCm">
            <Form.Label column sm='8'>Περιφέρεια (cm)</Form.Label>
            <Col sm='4'>
              <Form.Control
          ref={this.circumferenceCm}
          name="circumferenceCm"
                        required
                        type="number"
                        value={circumferenceCm}
                        onChange={(ev)=>this.handleChange(ev.target.name, ev.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="raisedSidewalk">
            <Form.Label column sm='8'>Ανασηκωμένο πεζοδρόμιο</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='raisedSidewalk'
                          checked={raisedSidewalk}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="powerlineProximity">
            <Form.Label column sm='8'>Εγγύτητα σε ΔΕΗ</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='powerlineProximity'
                          checked={powerlineProximity}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="obstruction">
            <Form.Label column sm='8'>Εμποδίζει διεύλευση</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='obstruction'
                          checked={obstruction}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="debris">
            <Form.Label column sm='8'>Θραύσματα</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='debris'
                          checked={debris}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="litter">
            <Form.Label column sm='8'>σκουπίδια</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='litter'
                          checked={litter}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>          

          <Form.Group as={Row} controlId="trunkDamaga">
            <Form.Label column sm='8'>πληγώσεις</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='trunkDamage'
                          checked={trunkDamage}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>          

          <Form.Group as={Row} controlId="fallHazard">
            <Form.Label column sm='8'>κίνδυνος πτώσης</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='fallHazard'
                          checked={fallHazard}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>          

          <Form.Group as={Row} controlId="publicInterest">
            <Form.Label column sm='8'>δημοσίου ενδιαφέροντος</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='publicInterest'
                          checked={publicInterest}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>          

          <Form.Group as={Row} controlId="disease">
            <Form.Label column sm='8'>ασθένεια</Form.Label>
            <Col sm='4'>
              <Form.Check type='checkbox'
                          name='disease'
                          checked={disease}
                          onChange={(ev)=>this.handleChange(ev.target.name, ev.target.checked)}
              />
            </Col>
          </Form.Group>          

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


