import React, { useState, useEffect } from 'react';

// redux
import { useDispatch } from 'react-redux';
import { FetchDataByTime, FetchDataByPrice } from '../redux/action';

// style
import { Form, Row, Col } from 'react-bootstrap';

const SortByHome = () => {

  const [render, setRender] = useState('DESC-TIME');

  const dispatch = useDispatch();

  const filterBy = {
    1: 'DESC-TIME',
    2: 'DESC-PRICE',
    3: 'ASC-PRICE',
    4: 'ASC-TIME'
  };

  useEffect(() => {
    if (render === 'DESC-TIME' || render === 'ASC-TIME') {
      dispatch(FetchDataByTime(render.split('-TIME')[0]));
    } else {
      dispatch(FetchDataByPrice(render.split('-PRICE')[0]));
    }
  }, [dispatch, render]);

  const handleMenuClick = menu => setRender(filterBy[menu.currentTarget.value]);

  return ( 
    <div className="mt-3">
      <Form className="ml-5">
        <Form.Group as={Row} controlId="formHorizontal">
          <Form.Label className="d-flex align-items-center font-weight-bold">
            Sort By
          </Form.Label>
          <Col sm={3}>
            <Form.Control as="select" onChange={handleMenuClick}>
              <option value="1">Newest</option>
              <option value="2">Price : Highest - Lowest</option>
              <option value="3">Price : Lowest - Highest</option>
              <option value="4">Oldest</option>
            </Form.Control>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SortByHome;
