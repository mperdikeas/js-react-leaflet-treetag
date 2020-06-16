const React = require('react');


const assert = require('chai').assert;




import { Form, Button } from 'react-bootstrap';

import wrapContexts from './context/contexts-wrapper.jsx';

import ReactComment from './react-comment.jsx';

class ModalNewRegionDefinition extends React.Component {

  constructor(props) {
    super(props);
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
  }

  render() {
    const {width: scrWidth, height: scrHeight} = this.props.geometryContext.screen;
    return (
      <>
      <dialog style={{width: 0.5*scrWidth}}ref={this.ref}>
        <div>Please enter a name for the new region:</div>
        <ReactComment text={`uuid is ${this.props.uuid}`}/>
        <Form onSubmit={this.createRegion}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="text" placeholder="Region name" />
            <Form.Text className="text-muted">
              Use a short, descriprive name
            </Form.Text>
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





export default wrapContexts(ModalNewRegionDefinition);
