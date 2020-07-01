import React, {Dispatch} from 'react';
import { connect, ConnectedProps }          from 'react-redux';

import chai from '../../util/chai-util.js';
// @ts-expect-error
const assert = chai.assert;



import {clearModal} from '../../redux/actions/index.ts';
import {ActionClearModal} from '../../redux/actions/action-types.ts';

import LoginForm     from './login-form.jsx';



const mapDispatchToProps = (dispatch: Dispatch<ActionClearModal>) => {
  return {
    clearModal: (uuid: string) => dispatch(clearModal(uuid))
  };
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {uuid: string, followUpFunc: ()=>void};

class ModalLogin extends React.Component<Props, {}> {

  private ref = React.createRef<HTMLDialogElement>();

  private escapeKeySuppressor = (e: React.KeyboardEvent)=>{
      console.log(`key pressed: ${e.key}`);
      if (e.key === 'Escape') {
        console.log('preventing default and stopping propagation');
        e.preventDefault();
        e.stopPropagation();
        }
  }; 

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    const domElem: HTMLDialogElement = this.ref.current!;
    domElem.showModal();
    (document as any).addEventListener('keydown', this.escapeKeySuppressor);
    ($('#dialog') as any).draggable();
  }

  componentWillUnmount() {
    console.log('component will unmount');
    (document as any).removeEventListener('keydown', this.escapeKeySuppressor);
    }


  render() {
    return (
      <>
      <dialog id='dialog' ref={this.ref}>
        <LoginForm followUpFunc={ ()=>{
            this.props.clearModal(this.props.uuid);
            this.props.followUpFunc();
          }}
        />
      </dialog>
      {this.props.children}
      </>
    )
  }
}

export default connector(ModalLogin);


