import React from 'react';

// style
import { Form, Row, Col } from 'react-bootstrap';

const FilterSubmission = ({handleMenuClick}) => {

  return ( 
    <div className="mt-5">
      <Form className="ml-5">
        <Form.Group as={Row} controlId="formHorizontal">
          <Form.Label className="d-flex align-items-center font-weight-bold">
            Sort By
          </Form.Label>
          <Col sm={3}>
            <Form.Control as="select" onChange={handleMenuClick}>
              <option value="1">Newest</option>
              <option value="2">Status : Pending</option>
              <option value="3">Status : Confirm</option>
              <option value="4">Status : Reject</option>
              <option value="5">Oldest</option>
            </Form.Control>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default FilterSubmission;