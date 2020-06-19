import React, { useState, useEffect } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { GetCategory, FetchProduct } from '../../redux/action';

// child
import ActiveAuctPagination from '../../components/ActiveAuctPagination';

// style
import { Form, Row, Col, Figure, Card } from 'react-bootstrap';
import { Container, Grid } from 'semantic-ui-react';

// others
import Moment from "moment";
import DateCountdown from "react-date-countdown-timer";

// sample image
import SampleImage from '../../asset/SSB-1.jpeg';

const ActiveAuctions = () => {

  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [auct, setAuct] = useState([]);

  const dispatch = useDispatch();

  const gCategory = useSelector(({ product }) => product.category);
  const getAuct = useSelector(({ product }) => product.product);
  const totalAuct = useSelector(({ product }) => product.count);
  const loading = useSelector(({ product }) => product.loading);

  const MAX_LENGTH = 50;
  const AuctPerPage = 10;
  const offset = AuctPerPage * (currentPage - 1);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    dispatch(GetCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(FetchProduct(AuctPerPage, offset, 'DESC'));
  }, [dispatch, AuctPerPage, offset]);

  useEffect(() => {
    if (gCategory) setCategory(gCategory);
  }, [gCategory]);

  useEffect(() => {
    if (getAuct) setAuct(getAuct);
  }, [getAuct]);

  const renderAuct = () => {
    return auct.map((val, idx) => {
      let countDown = Moment(val.due_date).format();
      return (
        <Card key={idx} className="ml-2 mt-3">
          <p>{val.countDown}</p>
          <p className="text-center" style={{ width: "175px", height: "60px" }}>
            <strong>End within : </strong><DateCountdown dateTo={countDown} />
          </p>
          <Figure>
            <Figure.Image 
              width={175}
              height={180}
              alt={val.product_name}
              src={SampleImage}
            />
            <div style={{ width: "175px" }}>
              <p>{`${val.product_desc.substring(0, MAX_LENGTH)}...`}</p>
            </div>
          </Figure>
        </Card>
      );
    });
  };

  const renderCtg = () => {
    return category.map((val, idx) => {
      return <option key={idx} value={idx +2}>{val.category}</option>
    });
  };

  return (
    <div className="mt-4 ml-5 mr-5">
      <div className="d-flex justify-content-between">
        <Form >
          <Form.Group as={Row} controlId="formHorizontal">
            <Form.Label className="d-flex align-items-center font-weight-bold">
              Filter By Status
            </Form.Label>
            <Col md={3}>
            <Form.Control as="select">
              <option value="1">Active</option>
              <option value="2">Close</option>
            </Form.Control>
            </Col>
            <Form.Label className="d-flex align-items-center ml-4 font-weight-bold">
              Filter By Category
            </Form.Label>
            <Col md={3}>
            <Form.Control as="select">
              <option value="1">All</option>
              {renderCtg()}
            </Form.Control>
            </Col>
          </Form.Group>
        </Form>
      </div>
      <Container className="mt-4">
        <Grid columns={5}>
          {renderAuct()}
        </Grid>
      </Container>
      <ActiveAuctPagination 
        AuctPerPage={AuctPerPage}
        totalAuct={totalAuct}
        paginate={paginate}
      />
    </div>
  );
};

export default ActiveAuctions;