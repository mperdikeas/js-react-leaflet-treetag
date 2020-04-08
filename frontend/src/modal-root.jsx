const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import Map                                     from './map.jsx';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

import ModalAppIsLoading             from './modal-app-is-loading.jsx';
import ModalLogin                    from './modal-login.jsx';
import ModalSaveWorkspaceToDisk      from './modal-save-workspace-to-disk.jsx';
import ModalInsertGeoJSONToWorkspace from './modal-insert-geoJSON-workspace.jsx';
import ModalUsernameReminder         from './modal-username-reminder.jsx';

import {MODAL_APP_IS_LOADING
      , MODAL_LOGIN
      , MDL_SAVE_WS_2_DSK
      , MDL_INS_GJSON_2_WS} from './constants/modal-types.js';

const MODAL_COMPONENTS = {
  MODAL_APP_IS_LOADING: ModalAppIsLoading,
  MODAL_LOGIN: ModalLogin,
  MDL_SAVE_WS_2_DSK: ModalSaveWorkspaceToDisk,
  MDL_INS_GJSON_2_WS: ModalInsertGeoJSONToWorkspace,
  MDL_USERNAME_REMINDER: ModalUsernameReminder
};



// redux
import {  connect   }              from 'react-redux';
import { clearModal, addGeometry } from './actions/index.js';

const mapStateToProps = (state) => {
  return state;
};


const ModalRoot = ({geometryContext, modals, children}) => {
  if (modals.length === null) {
    return (<>
      {children}
      </>
    )
  } else {
    const X = 0;
    const Y = 0.3*geometryContext.screen.height;
    const step = 20;
    const specificModals = modals.map( (modal, idx) => {
      const {modalType, modalProps} = modal;
      const SpecificModal = MODAL_COMPONENTS[modalType]
      return <SpecificModal style={{top: Y+idx*step, left: X+idx*step}} key={idx} {...modalProps}/>
    } );

    return (
      <>
      {specificModals}
      {children}
      </>
    );
  }

}

export default connect(mapStateToProps, null)(wrapContexts(ModalRoot));


