const React = require('react');


const assert = require('chai').assert;




import { Button } from 'react-bootstrap';

import wrapContexts from './context/contexts-wrapper.tsx';

class ModalRetryCancel extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount = () => {
    const domElem = this.ref.current;
    domElem.showModal();
  }

  render() {
    const {width: scrWidth, height: scrHeight} = this.props.geometryContext.screen;
    return (
      <>
      <dialog style={{width: 0.5*scrWidth}}ref={this.ref}>
        <div>{this.props.html}</div>
        <div style={{display:'flex', justifyContent: 'space-around'}}>
          <Button style={{marginTop: '1em'}} variant='warning' onClick={this.props.cancelAction}>Cancel</Button>
          <Button style={{marginTop: '1em'}} variant='primary' onClick={this.props.retryAction}>Retry</Button>
        </div>
      </dialog>
      {this.props.children}
      </>
    )
  }
}





export default wrapContexts(ModalRetryCancel);
