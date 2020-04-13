const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import L from 'leaflet';

import {axiosPlain} from './axios-setup.js';
import {  connect   } from 'react-redux';


import {storeAccessToken} from './access-token-util.js';
import wrapContexts from './context/contexts-wrapper.jsx';

import { displayModal, clearModal, addToast } from './actions/index.js';
import {MDL_NOTIFICATION} from './constants/modal-types.js';

import ModalQueryForm from './modal-query-form.jsx';
import {GSN, globalGet, globalSet} from './globalStore.js';
import {layerIsEmpty, layerContainsAreas, isMarkerInsidePolygonsOfLayerGroup} from './leaflet-util.js';

const mapStateToProps = (state) => {
  return {
    modal: state.modal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearModal : () => dispatch(clearModal()),
    alertDrawnItemsIsEmpty: ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: <div>workspace is empty</div>})),
    alertDrawnItemsHasNoAreas: ()=>dispatch(displayModal(MDL_NOTIFICATION, {html: <div>workspace defines no areas</div>})),
    toastQuerySaved: (N, n)=>dispatch(addToast('query saved'
                                             , 'Query results are now saved in query layer. '
                                              +`${n} trees were selected out of a total of ${N} trees considered by the query`))
  };
}

class ModalQuery extends React.Component {

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    const domElem = this.ref.current;
    domElem.showModal();
    const body = document.getElementsByTagName('body')[0];
    this.escapeKeySuppressor = (e)=>{
      if (e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        }
    };
    document.addEventListener('keydown', this.escapeKeySuppressor);
    $('#dialog').draggable();
  }

  componentWillUnmount() {
    const body = document.getElementsByTagName('body')[0];
    document.removeEventListener('keydown', this.escapeKeySuppressor);
    }


  doQuery = () => {
    console.log(`we are now ready to do a query`);
    const map           = globalGet(GSN.LEAFLET_MAP);
    const layersControl = globalGet(GSN.LEAFLET_LAYERS_CONTROL);
    const drawnItems    = globalGet(GSN.LEAFLET_DRAWN_ITEMS);
    console.log('drawn items are:');
    console.log(drawnItems);
    console.log('drawn items END');
    if (layerIsEmpty(drawnItems)) {
      this.props.alertDrawnItemsIsEmpty();
    } else {
      if (! layerContainsAreas(drawnItems))
        this.props.alertDrawnItemsHasNoAreas();
      else {
        let totalTrees = 0;
        let treesSelected = 0;
        const trees = [];
        map.eachLayer( (layer) => {
          if (layer instanceof L.CircleMarker) {
            totalTrees++;
            if (isMarkerInsidePolygonsOfLayerGroup(layer, drawnItems)) {
              trees.push(layer);
              treesSelected++;
            }
          }
        } );
        console.log(`${totalTrees} trees found in total; ${treesSelected} added in query result`);
        const queryLayer = globalGet(GSN.LEAFLET_QUERY_LAYER, false);
        if (queryLayer) {
          layersControl.removeLayer(queryLayer);
        }
        const layerGroup = L.layerGroup(trees);
        globalSet(GSN.LEAFLET_QUERY_LAYER, layerGroup);
        layersControl.addOverlay(layerGroup, 'query results');
        this.props.clearModal();
        this.props.toastQuerySaved(totalTrees, treesSelected);
      }
    } // else <if (layerIsEmpty(drawnItems))>
  }



  render() {

    return (
      <>
      <dialog style={this.props.style} id='dialog' ref={this.ref}>
          <ModalQueryForm doQuery={this.doQuery}/>
      </dialog>
      {this.props.children}
      </>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(wrapContexts(ModalQuery));


