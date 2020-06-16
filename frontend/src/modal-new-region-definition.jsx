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


import {createRegion} from './redux/actions/index.js';

import PropTypes from 'prop-types';

import { v4 as uuidv4 } from 'uuid';


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
  };
};



class ModalNewRegionDefinition extends React.Component {

  static DEFINE_NEW_PARTITION = 'define a new partition...';

  static propTypes = {
    uuid: PropTypes.string.isRequired,
    partitions: PropTypes.arrayOf(PropTypes.string).isRequired,
    partition2regions: PropTypes.object.isRequired,
    wkt: PropTypes.string.isRequired
  };


  constructor(props) {
    super(props);
    assert.isAtLeast(props.partitions.length, 1, `TODO: handle the initialization case where no partitions are defined (${props.partitions.length}`);
    this.state = {region: '', partition: props.partitions[0], regionExistsInPartition: false}
    this.ref = React.createRef();
  }

  componentDidMount = () => {
    const domElem = this.ref.current;
    domElem.showModal();
  }

  createRegion = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('form:: region created');
    console.log(JSON.stringify(this.state));
    if (partition===ModalNewRegionDefinition.NEW_PARTITION) {
      console.log('spawn dialog to define new partition name and create region');

    } else {
      console.log('we have all the info we need, create the region and close the dialog');

      this.props.createRegion(this.state.region, this.props.wkt, this.state.partition, ['todo - add ids of dialogs to clear']);

    }
  }

  regionExistsInPartition = (region, partition) => {
    return this.props.partition2regions[partition].includes(region);
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
    const regionExistsInPartition = this.regionExistsInPartition(this.state.region, partition);
    this.setState({partition, regionExistsInPartition});
  }

  render() {
    const options = this.props.partitions.map( (x) => <option key={x}>{x}</option> );
    options.push(<option key={uuidv4()}>{ModalNewRegionDefinition.DEFINE_NEW_PARTITION}</option>);
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
          </Form.Group>



          <Form.Group controlId="partition">
            <Form.Label>Select partition to fall under</Form.Label>
            <Form.Control as="select" value={this.state.partition} onChange={this.onChangePartition}>
              {options}
            </Form.Control>
          </Form.Group>

          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <Button variant="warning">
              Cancel
            </Button>        
            <Button variant="primary" type="submit">
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
