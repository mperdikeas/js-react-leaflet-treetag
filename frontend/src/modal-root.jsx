const     _ = require('lodash');
const     $ = require('jquery');
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console


const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import {GeometryContext} from './context/geometry-context.jsx';

import Map                                     from './map.jsx';

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

const mapStateToProps = (modals) => {
  return modals;
};


const ModalRoot = ({modals, children}) => {
  console.log(modals);
  if (modals.length === null) {
    console.log('no modals left to display');
    return (<>
      {children}
      </>
    )
  } else {
    const specificModals = modals.map( (modal, idx) => {
      const {modalType, modalProps} = modal;
      const SpecificModal = MODAL_COMPONENTS[modalType]
      return <SpecificModal key={idx} {...modalProps}/>
    } );

    console.log(`rendering ${modals.length} modals`);
    return (
      <>
      {specificModals}
      {children}
      </>
    );
  }

}

export default connect(mapStateToProps, null)(wrapContexts(ModalRoot));


