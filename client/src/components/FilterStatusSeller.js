import React from 'react';

// style
import { Form, Row, Col } from 'react-bootstrap';

const FilterStatusSeller = ({handleMenuClick}) => {
  return ( 
    <Form className="ml-5">
      <Form.Group as={Row} controlId="formHorizontal">
        <Form.Label className="d-flex align-items-center font-weight-bold">
          Filter By Status
        </Form.Label>
        <Col sm={3}>
          <Form.Control as="select" onChange={handleMenuClick}>
            <option value="1">All</option>
            <option value="2">Active</option>
            <option value="3">Banned</option>
          </Form.Control>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default FilterStatusSeller;