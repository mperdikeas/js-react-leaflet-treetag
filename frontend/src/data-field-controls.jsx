const React = require('react');

const assert = require('chai').assert;

import {Form, Col, Row, Button, Nav} from 'react-bootstrap';

const style={marginLeft: 0, marginRight: 0, marginBottom: 0};


export function IntegerDataFieldFactory (onChange) {

  return (props) => {

    return (
      <Form.Group as={Row} controlId={props.name} style={style}>
        <Form.Label column sm='8'>{props.label}</Form.Label>
        <Col sm='4'>
          <Form.Control required
                        type="number"
                        name={props.name}
                        value={props.value}
                        onChange={(ev)=>onChange(ev.target.name, parseInt(ev.target.value))}
          />
        </Col>
      </Form.Group>


    );
  }
}


export function BooleanDataFieldFactory (onChange) {

  return (props) => {

    return (
      <Form.Group as={Row} controlId={props.name} style={style}>
        <Form.Label column sm='8'>{props.label}</Form.Label>
        <Col sm='4'>
          <Form.Check type='checkbox'
                      name={props.name}
                      checked={props.value}
                      onChange={(ev)=>onChange(ev.target.name, ev.target.checked)}
          />
        </Col>
      </Form.Group>
    );
  };
}


export function SelectDataFieldFactory (onChange) {

  return (props) => {
    const {codeToName} = props;
    const options = Array.from(codeToName.keys()).map(function(key, index) {
      const name = codeToName.get(key);
      assert.exists(name);
      return <option key={index} value={key}>{name}</option>;
    });
    return (
      <Form.Group as={Row} controlId={props.name} style={style}>
        <Form.Label column sm='8'>{props.label}</Form.Label>
        <Col sm='4'>
          <Form.Control as="select"
                        required
                        name={props.name}
                        value={props.value}
                        onChange={(ev)=>onChange(ev.target.name, ev.target.value)}>
            {options}
          </Form.Control>
        </Col>
      </Form.Group>
    );
  };
}

export function TextAreaDataFieldFactory (onChange) {
  return (props) => {
    return (
      <Form.Group as={Row} controlId={props.name} style={style}>
        <Form.Label column sm='4'>{props.label}</Form.Label>
        <Col sm='8'>
          <Form.Control as='textarea'
                        rows='5'
                        required
                        type="text"
                        name={props.name}
                        value={props.value}
                        onChange={(ev)=>onChange(ev.target.name, ev.target.value)}
          />
        </Col>
      </Form.Group>
    );
  };
}
