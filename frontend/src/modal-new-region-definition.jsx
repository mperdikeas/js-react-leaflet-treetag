const React = require('react');

const assert = require('chai').assert;

import {connect} from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import wrapContexts from './context/contexts-wrapper.jsx';

import ReactComment from './react-comment.jsx';

import PropTypes from 'prop-types';

import { v4 as uuidv4 } from 'uuid';


const mapStateToProps = (state) => {
  return {
    partitions: partitions(state)
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
    partitions: PropTypes.arrayOf(PropTypes.string).isRequired // this also works with Redux properties ain't that great?
  };


  constructor(props) {
    super(props);
    this.state = {region: '', partition: ''}
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

      this.props.createRegion(region, 'todo - replace with actual WKT', partition, ['todo - add ids of dialogs to clear']);

    }
  }

  onChangeRegion = (e) => {
    this.setState({region: e.target.value});
  }

  onChangePartition = (e) => {
    const partition = e.target.value;
    console.log(partition);
    this.setState({partition});
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
            <Form.Text className="text-muted">
              Use a short, descriprive name
            </Form.Text>
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
