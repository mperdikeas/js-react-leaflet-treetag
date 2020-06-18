const React = require('react');

import chai from './util/chai-util';
const assert = chai.assert;


import {connect} from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import wrapContexts from './context/contexts-wrapper.jsx';

import ReactComment from './react-comment.jsx';

import {partitions
      , wktRegionUnderConstruction
      , partition2regions} from './redux/selectors/index.js';


import {createRegion, clearModal} from './redux/actions/index.js';

import PropTypes from 'prop-types';

import { v4 as uuidv4 } from 'uuid';

import { Radio } from 'antd';


const mapStateToProps = (state) => {
  return {
    partitions: partitions(state)
    , partition2regions: partition2regions(state)
    , wkt: wktRegionUnderConstruction(state)
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    createRegion: (region, wkt, partition, idOfDialogsToClear) => dispatch(createRegion(region, wkt, partition, idOfDialogsToClear))
    , cancel: (uuid) => dispatch(clearModal(uuid))
  };
};

const USE_EXISTING = 1;
const DEFINE_NEW = 2;


class ModalNewRegionDefinition extends React.Component {


  static propTypes = {
    uuid: PropTypes.string.isRequired,
    partitions: PropTypes.arrayOf(PropTypes.string).isRequired,
    partition2regions: PropTypes.object.isRequired,
    wkt: PropTypes.string.isRequired
  };


  constructor(props) {
    super(props);
    assert.isAtLeast(props.partitions.length, 1, `TODO: handle the initialization case where no partitions are defined (${props.partitions.length}`);
    this.state = {
      region: ''
      , partition: props.partitions[0]
      , regionExistsInPartition: false
      , useExistingOrCreateNewPartition: USE_EXISTING
      , partitionExists: false
    };
    this.ref = React.createRef();
  }

  createButtonDisabled = ()=>{
    const regionNotOK = this.state.regionExistsInPartition || (this.state.region==='');
    const partitionNotOk = (()=>{
      switch (this.state.useExistingOrCreateNewPartition) {
        case USE_EXISTING:
          return false;
        case DEFINE_NEW:
          return (this.state.partitionExists || (this.state.partition===''));
      }})();
    return regionNotOK || partitionNotOk;
  }

  componentDidMount = () => {
    const domElem = this.ref.current;
    domElem.showModal();
  }

  onCancel = () => {
    this.props.cancel(this.props.uuid);
  }

  createRegion = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('form:: region created');
    console.log(JSON.stringify(this.state));
    // TODO: think about possible race condition if someone else creates a region by the same name at the same time
    this.props.createRegion(this.state.region, this.props.wkt, this.state.partition, [this.props.uuid]);
  }

  regionExistsInPartition = (region, partition) => {
    const regionsInPartition = this.props.partition2regions[partition];
    return (regionsInPartition!==undefined) && (regionsInPartition.includes(region));
  }

  partitionExists = (partition) => {
    return Object.keys(this.props.partition2regions).includes(partition);
  }

  onChangeRegion = (e) => {
    const region = e.target.value;
    console.log(this.props.partition2regions);
    console.log(JSON.stringify(this.props.partition2regions));
    console.log(this.state.partition);
    const regionExistsInPartition = this.regionExistsInPartition(region, this.state.partition);
    this.setState({region, regionExistsInPartition});
  }

  onChangePartition = (e) => {
    const partition = e.target.value;
    const partitionExists = this.partitionExists(partition);
    this.setState({partition, partitionExists});
  }

  useExistingOrCreateNewPartition = (v) => {
    this.setState({useExistingOrCreateNewPartition: v});
  }

  render() {

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    
    const options = this.props.partitions.map( (x) => <option key={x}>{x}</option> );
    const {width: scrWidth, height: scrHeight} = this.props.geometryContext.screen;
    return (
      <>
      <dialog style={{width: 0.5*scrWidth}}ref={this.ref}>
        <ReactComment text={`uuid is ${this.props.uuid}`}/>
        <Form onSubmit={this.createRegion}>


          <Form.Group controlId="regionName">
            <Form.Label>Region name</Form.Label>
            <Form.Control type="text"
                          placeholder="Region name"
                          value={this.state.region}
                          onChange={this.onChangeRegion}/>
            {
              this.state.regionExistsInPartition?(
            <Form.Text className="text-warning">
              region already exists in partition
            </Form.Text>):null
            }
            {
              this.state.region===''?(
            <Form.Text className="text-warning">
              cannot be empty
            </Form.Text>):null
            }
          </Form.Group>


          <Radio.Group onChange={(e)=>this.useExistingOrCreateNewPartition(e.target.value)} value={this.state.useExistingOrCreateNewPartition}>
            <Radio style={radioStyle} value={USE_EXISTING}>
              Use an existing partition
            </Radio>
            <Radio style={radioStyle} value={DEFINE_NEW}>
              Define a new partition
            </Radio>
          </Radio.Group>


          {(this.state.useExistingOrCreateNewPartition===USE_EXISTING)?(
          <Form.Group controlId="partition">
            <Form.Label>Select partition to fall under</Form.Label>
            <Form.Control as="select" value={this.state.partition} onChange={this.onChangePartition}>
              {options}
            </Form.Control>
          </Form.Group>
          ):(
            <Form.Group controlId='partitionName'>
            <Form.Label>Region name</Form.Label>
            <Form.Control type='text'
            placeholder='Partition name'
            value={this.state.partition}
            onChange={this.onChangePartition}/>
            {
              this.state.partitionExists?(
                <Form.Text className='text-warning'>
                  partition name already exists
                </Form.Text>):null
            }
              {
                this.state.partition===''?(
                  <Form.Text className="text-warning">
                    cannot be empty
                  </Form.Text>):null
              }
            </Form.Group>
          )}
      
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <Button variant="warning" onClick={this.onCancel}>
              Cancel
            </Button>        
            <Button disabled={this.createButtonDisabled()} variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
        {this.props.children}
      </dialog>
      </>
    )
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalNewRegionDefinition));
