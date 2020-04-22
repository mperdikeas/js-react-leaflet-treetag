const React = require('react');

const assert = require('chai').assert;

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';


export function NumericDataFieldFactory (onChange) {

  return (props) => {

    return (
      <Form.Group as={Row} controlId={props.name}>
        <Form.Label column sm='8'>{props.label}</Form.Label>
        <Col sm='4'>
          <Form.Control
                        required
                        type="number"
                        name={props.name}
                        value={props.value}
                        onChange={(ev)=>onChange(ev.target.name, ev.target.value)}
          />
        </Col>
      </Form.Group>


    );
  }
}
