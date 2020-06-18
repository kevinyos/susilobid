import React, { useState, useEffect } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { GetTopup, RejectTopup, ConfirmTopup, FilterPaymentByStatus, FilterPaymentByUsername } from '../../redux/action';
import { API_URL } from '../../support/API_URL';

// style
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import Loader from 'react-loader-spinner';
import Swal from 'sweetalert2';

// children
import TopupPagination from '../../components/TopupPagination';
import FilterPayment from '../../components/FilterPayment';

// moment.js
import Moment from 'moment';

const WalletVerif = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState('');
  const [validateReject, setValidateReject] = useState(false);
  const [render, setRender] = useState('DESC');
  const [filterUser, setFilterUser] = useState('');

  const filterBy = {
    1: 'DESC',
    2: 'Pending',
    3: 'Confirm',
    4: 'Reject',
    5: 'ASC'
  };

  const fetchData = useSelector(state => state.topup.data);
  const totalTopup = useSelector(state => state.topup.count);
  const loadingTopup = useSelector(state => state.topup.loading);

  const dispatch = useDispatch();

  const topupPerPage = 5;
  const offset = topupPerPage * (currentPage - 1);
  const paginate = pageNum => setCurrentPage(pageNum);

  useEffect(() => {
    if (render === 'DESC' || render === 'ASC') {
      dispatch(GetTopup(topupPerPage, offset, render));
    } else {
      dispatch(FilterPaymentByStatus(topupPerPage, offset, render));
    }
  }, [dispatch, offset, render]);

  const handleMenuClick = menu => setRender(filterBy[menu.currentTarget.value]);

  const handleToggle = id => {
    setOpenModal(true);
    setSelectedId(id);
    setValidateReject(false);
  };

  const handleZoom = img => {
    Swal.fire({
      imageUrl: img,
      imageWidth: 600,
      imageHeight: 400,
      imageAlt: "Custom image"
    });
  };

  const handleReject = id => {
    if (!note) {
      setValidateReject(true);
    } else {
      Swal.fire({
        title: 'Are you sure you wnat to reject this payment?',
        text: "This rejection will send to user's email",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reject it!'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Rejected!',
            'This payment verification has been rejected.',
            'success'
          );
          dispatch(RejectTopup(id, note));
          dispatch(GetTopup(topupPerPage, offset, render));
        }
      });
    }
  };

  const handleConfirm = (id, userId, amount) => {
    if (!note) {
      Swal.fire({
        title: 'Are you sure you want to confirm this payment?',
        text: "This confirmation will send to user's email",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, confirm it!'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Approved!',
            'This payment verification has been approved.',
            'success'
          );
          dispatch(ConfirmTopup(id, userId, amount));
          dispatch(GetTopup(topupPerPage, offset, render));
        }
      });
    } else {
      Swal.fire(
        "Please empty notes before approving payment"
      );
    }
  };

  const handleChange = e => {
    if (!e.target.value) dispatch(GetTopup(topupPerPage, offset, render));
    setFilterUser(e.target.value);
  };

  const handleBtn = () => dispatch(FilterPaymentByUsername(filterUser, topupPerPage, offset));

  const renderModal = () => {
    let detail = fetchData.find(val => val.trx_id === selectedId);
    let detailArray = [];
    detailArray.push(detail);

    if (detail) {
      return (
        <div>
          <Modal isOpen={openModal} toggle={handleToggle} size="lg" centered>
            {detailArray.map((val, idx) => {
              return (
                <>
                  <ModalHeader key={idx} toggle={handleToggle}>
                    Transaction Id : {val.trx_id}
                  </ModalHeader>
                  <ModalBody className="row">
                    <div className="col-8">
                      <img  
                        className="img-thumbnail img-zoom"
                        alt={val.slip_image}
                        src={API_URL + val.slip_image}
                        style={{ height: "25rem" }}
                        onClick={() => handleZoom(API_URL + val.slip_image)}
                      />
                    </div>
                    <div className="col-4">
                      <Container>
                        <Row>
                          <Col sm={4}>Username</Col>
                          <Col sm={8}>: {val.username}</Col>
                        </Row>
                        <hr />
                        <Row>
                          <Col sm={4}>Nominal Topup</Col>
                          <Col sm={8}>: Rp {val.amount ? val.amount.toLocaleString() : null}</Col>
                        </Row>
                        <hr />
                        <Row>
                          <Col sm={4}>Payment Time</Col>
                          <Col sm={8}>: {Moment(val.date_of_trx).format("Do MMMM YYYY, HH:mm:ss") + " WIB"}</Col>
                        </Row>
                        <hr />
                        <Row>
                          <Col sm={4}>Status</Col>
                          <Col sm={8}>: {val.status_trx}</Col>
                        </Row>
                        <hr />
                      </Container>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    {
                      val.status_trx !== 'Pending' ?
                      <Button className="btn-bootstrap" onClick={handleToggle}>Close</Button>
                      :
                      <>
                        <Form>
                          {validateReject ? 
                            <>
                              <Form.Control type="text" className="is-invalid" placeholder="Notes" onChange={e => setNote(e.target.value)} />
                              <div className="invalid-feedback">
                                Please input notes before reject
                              </div>
                            </>
                            :
                            <Form.Control type="text" placeholder="Notes" onChange={e => setNote(e.target.value)} />
                          }
                        </Form>
                        <Button variant="danger" onClick={() => handleReject(val.trx_id)}>
                          {
                            loadingTopup
                            ?
                              <Loader type="Circles" color="#fff" height={20} width={20} />
                            :
                            'Reject'
                          }
                        </Button>
                        <Button variant="warning" onClick={() => handleConfirm(val.trx_id, val.buyer_id, val.amount)}>
                          {
                            loadingTopup
                            ?
                              <Loader type="Circles" color="#fff" height={20} width={20} />
                            :
                            'Confirm'
                          }
                        </Button>
                      </>
                    }
                  </ModalFooter>
                </>
              )
            })}
          </Modal>
        </div>
      );
    }
  };

  const renderTable = () => {
    return fetchData.map((val, idx) => {
      return (
        <tr key={idx}>
          <td>{val.trx_id}</td>
          <td>{val.username}</td>
          <td>Rp {val.amount ? val.amount.toLocaleString() : null}</td>
          <td>
            {Moment(val.date_of_trx).format("Do MMMM YYYY, HH:mm:ss") + " WIB"}
          </td>
          <td>
            <img className="img-zoom" src={API_URL + val.slip_image} alt="PYM image" height="80px" onClick={() => handleZoom(API_URL + val.slip_image)} />
          </td>
          <td>{val.status_trx}</td>
          <td>
            <button class="ui teal button" onClick={() => handleToggle(val.trx_id)}>View</button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className='mt-4'>
      <FilterPayment handleMenuClick={handleMenuClick} />
      <Form className='ml-5'>
        <Form.Group as={Row} controlId="formHorizontalEmail">
          <Form.Label className='d-flex align-items-center font-weight-bold'>
            Filter By Username
          </Form.Label>
          <Col sm={3} >
            <Form.Control type="text" placeholder="Username" name="username" onChange={e => handleChange(e)} />
          </Col>
          <Button className="btn-bootstrap" onClick={handleBtn}>Search</Button>
        </Form.Group>
      </Form>
      <div className="d-flex justify-content-between">
        <table class="ui single line table" style={{ marginLeft: "20px", marginRight: "20px" }}>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Buyer</th>
              <th>Amount</th>
              <th>Payment Date</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              loadingTopup
                ?
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <div className="d-flex align-items-center" style={{ height: "400px" }}>
                      <Loader type="Circles" color="#009C95" height={70} width={70} />
                    </div>
                  </td>
                </tr>
                : 
                renderTable()
            }
          </tbody>
        </table>
        {renderModal()}
      </div>
      <TopupPagination 
        topupPerPage={topupPerPage}
        paginate={paginate}
        totalTopup={totalTopup}
      />
    </div>
  );
};

export default WalletVerif;