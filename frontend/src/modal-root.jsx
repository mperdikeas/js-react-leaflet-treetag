const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;
import axios from 'axios';

import {GeometryContext} from './context/geometry-context.jsx';

import Map                                     from './map.jsx';
import {BASE_URL}                              from './constants.js';

import './css/modal-dialog.css'; // TODO: use React emotion for element-scoped CSS

import wrapContexts from './context/contexts-wrapper.jsx';

import ModalLogin                    from './modal-login.jsx';
import ModalSaveWorkspaceToDisk      from './modal-save-workspace-to-disk.jsx';
import ModalInsertGeoJSONToWorkspace from './modal-insert-geoJSON-workspace.jsx';

import {MODAL_LOGIN
      , MDL_SAVE_WS_2_DSK
      , MDL_INS_GJSON_2_WS} from './constants/modal-types.js';

const MODAL_COMPONENTS = {
  MODAL_LOGIN: ModalLogin,
  MDL_SAVE_WS_2_DSK: ModalSaveWorkspaceToDisk,
  MDL_INS_GJSON_2_WS: ModalInsertGeoJSONToWorkspace
};



// redux
import {  connect   }              from 'react-redux';
import { clearModal, addGeometry } from './actions/index.js';

const mapStateToProps = (state) => {
  return state.modal;
};


const ModalRoot = ({modal, children}) => {
  if (modal === null) {
    console.log('modal root is cleared !!');
    return (<>
      {children}
      </>
    )
  } else {
    const {modalType, modalProps} = modal;
    const SpecificModal = MODAL_COMPONENTS[modalType]
    console.log(`rendering modal for ${modalType}`);
    return (
      <>
          <SpecificModal {...modalProps}>
          </SpecificModal>
          {children}
      </>
    );
  }

}

export default connect(mapStateToProps, null)(wrapContexts(ModalRoot));


