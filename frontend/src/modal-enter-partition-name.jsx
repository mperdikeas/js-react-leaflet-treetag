const React = require('react');

const assert = require('chai').assert;


import { Form, Button } from 'react-bootstrap';

import PropTypes from 'prop-types';

import { v4 as uuidv4 } from 'uuid';

class ModalEnterPartitionName extends React.Component {

  static propTypes = {
    uuid: PropTypes.string.isRequired,
    partitions: PropTypes.arrayOf(PropTypes.string).isRequired
  };


  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {partition: '', alreadyExists: false};
  }

  componentDidMount = () => {
    const domElem = this.ref.current;
    domElem.showModal();
  }

  onChangePartition = (e) => {
    const partition = e.target.value;
    const alreadyExists = this.props.partitions.includes(partition);
    this.setState({partition, alreadyExists});
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


          <Form.Group controlId="partitionName">
            <Form.Label>Partition name</Form.Label>
            <Form.Control type="text"
                          placeholder="Region name"
                          value={this.state.region}
                          onChange={this.onChangeRegion}/>
            {this.state.alreadExists?(<Form.Text className="text-warning">
              Name already exists
            </Form.Text>):null}
          </Form.Group>

          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <Button variant="warning">
              Cancel
            </Button>        
            <Button variant="primary" type="submit">
              Create
            </Button>
          </div>
        </Form>
        {this.props.children}
      </dialog>
      </>
    )
  }
}





export default ModalEnterPartitionName;
