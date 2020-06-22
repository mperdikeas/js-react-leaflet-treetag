const React = require('react');
var      cx = require('classnames');

const assert = require('chai').assert;

import Map                                     from './map.jsx';
import TreeInformationPanel                    from './information-panel-tree.jsx';
import PointCoordinates                        from './point-coordinates.jsx';
import Toolbox                                 from './toolbox.jsx';
import ToastsStack                             from './components/toasts/toasts-stack.jsx';
import ModalRoot                               from './modal-root.jsx';
import UserControl                             from './user-control.jsx';

import wrapContexts                            from './context/contexts-wrapper.jsx';

import {Nav} from 'react-bootstrap';

// REDUX
import { connect }          from 'react-redux';
import {changeTileProvider} from './redux/actions/index.js';



const OVERVIEW_MAP      = 'OVERVIEW_MAP';
const REGION_MGMNT      = 'REGION_MGMNT';
const REGION_OVERLAPS   = 'REGION_OVERLAPS';

import { withRouter } from 'react-router-dom'

class LandingPageContainer extends React.Component {

  onSelect = (selectedKey) => {
    switch (selectedKey) {
      case OVERVIEW_MAP:
        this.props.history.push('/main/map');
        break;
      case REGION_MGMNT:
        this.props.history.push('/main/regions/definition');
        break;
      case REGION_OVERLAPS:
        this.props.history.push('/main/regions/overlaps');
        break;
      default:
        throw `unhandled key: ${selectedKey}`;
    }
  }


  render() {
    return (
      <Nav variant='pills' 
           justify={true} 
           className="flex-column"
           onSelect={this.onSelect}
      >
      <Nav.Item>
        <Nav.Link eventKey={OVERVIEW_MAP}>Γενικά</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey={REGION_MGMNT}>Διαχείριση περιοχών</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey={REGION_OVERLAPS}>Διαχείριση επικαλύψεων</Nav.Link>
      </Nav.Item>      
      </Nav>
    );

  }
}

export default withRouter((wrapContexts(LandingPageContainer)));

