//const React = require('react');

import React from 'react';

import {default as wrapContexts}                            from './context/contexts-wrapper.tsx';

import {Nav} from 'react-bootstrap';

const OVERVIEW_MAP      = 'OVERVIEW_MAP';
const REGION_MGMNT      = 'REGION_MGMNT';
const REGION_OVERLAPS   = 'REGION_OVERLAPS';

import { withRouter } from 'react-router-dom'

import { RouteComponentProps } from 'react-router-dom';

// https://stackoverflow.com/a/49342714/274677
interface IChildComponentProps extends RouteComponentProps<any> {
  /* other props for ChildComponent */
}

class LandingPageContainer extends React.Component<IChildComponentProps, any> {

  constructor(props: any) {
    super(props);
  }

  onSelect = (selectedKey: string) => {
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


export default withRouter(wrapContexts(LandingPageContainer));



