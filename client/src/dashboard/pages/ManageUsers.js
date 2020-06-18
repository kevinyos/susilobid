import React, { useState, useEffect } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { GetAllUsers, SearchUser, BanUser, UnbanUser, FilterUserByStatus } from '../../redux/action';

// children
import UserPagination from '../../components/UserPagination';
import FilterStatusUser from '../../components/FilterStatusUser';

// style
import { Button, Form, Row, Col } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import Swal from 'sweetalert2';
import './ManageUsers.css';

const ManageUsers = () => {

  const [filterEmail, setFilterEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [byStatus, setByStatus] = useState('All');

  const filterStatus = {
    1: 'All',
    2: 'Active',
    3: 'Banned'
  };

  const fetchUser = useSelector(({ user }) => user.data);
  const totalUsers = useSelector(({ user }) => user.count);
  const loading = useSelector(({ user }) => user.loading);

  const dispatch = useDispatch();

  const userPerPage = 8;
  const offset = userPerPage * (currentPage - 1);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  useEffect(() => {
    if (byStatus === 'All') {
      dispatch(GetAllUsers(userPerPage, offset));
    } else {
      dispatch(FilterUserByStatus(userPerPage, offset, byStatus));
    }
  }, [dispatch, currentPage, offset, byStatus]);

  const handleMenuClick = status => {
    setByStatus(filterStatus[status.currentTarget.value]);
  };

  const handleChange = e => {
    if (!e.target.value) dispatch(GetAllUsers(userPerPage, offset));
    setFilterEmail(e.target.value);
  };

  const handleBtn = () => dispatch(SearchUser(filterEmail, userPerPage, offset));

  const handleBan = (id, email) => {
    Swal.fire({
      title: `Are you sure you want to ban ${email}?`,
      text: "You can unban this user after banned",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ban this user!'
    }).then((result) => {
      if (result.value) {
        dispatch(BanUser(id));
        dispatch(GetAllUsers(userPerPage, offset));
        Swal.fire(
          'Banned!',
          `${email} has been banned`,
          'success'
        );
      };
    });
  };

  const handleUnban = (id, email) => {
    Swal.fire({
      title: `Are you sure you want to Unban ${email}?`,
      text: "Changes will be save",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Unban this user!'
    }).then((result) => {
      if (result.value) {
        dispatch(UnbanUser(id));
        dispatch(GetAllUsers(userPerPage, offset));
        Swal.fire(
          'Unbanned!',
          `${email} has been Unbanned`,
          'success'
        );
      };
    });
  };

  const renderTable = () => {
    return fetchUser.map((val, idx) => {
      return (
        <tr key={idx}>
          <td>{val.user_id}</td>
          <td>{val.username}</td>
          <td>{val.email}</td>
          <td>{val.address}</td>
          <td>{val.phone}</td>
          <td>{val.status}</td>
          <td>
            {
              val.status === 'Active'
                ?
                <Button variant="danger" onClick={() => handleBan(val.user_id, val.email)}>
                  {
                    loading
                      ?
                      <Loader type="Circles" color="#009C95" height={20} width={20} />
                      :
                      'Ban'
                  }
                </Button>
                :
                <Button variant="primary" onClick={() => handleUnban(val.user_id, val.email)}>
                  {
                    loading
                      ?
                      <Loader type="Circles" color="#009C95" height={20} width={20} />
                      :
                      'Unban'
                  }
                </Button>
            }
          </td>
        </tr>
      );
    });
  };

  return (
    <div className='mt-4'>
      <Form className='ml-5'>
        <Form.Group as={Row} controlId="formHorizontalEmail">
          <Form.Label className='d-flex align-items-center font-weight-bold'>
            Filter By Email
          </Form.Label>
          <Col sm={3} >
            <Form.Control type="email" placeholder="Email" name="email" onChange={e => handleChange(e)} />
          </Col>
          <Button className="btn-bootstrap" onClick={handleBtn}>Search</Button>
        </Form.Group>
      </Form>
      <FilterStatusUser handleMenuClick={handleMenuClick} />
      <div className="d-flex justify-content-center">
        <table class="ui single line table" style={{ marginLeft: '20px', marginRight: '20px' }}>
          <thead class="">
            <tr class="">
              <th class="">User ID</th>
              <th class="">Username</th>
              <th class="">Email Address</th>
              <th class="">Address</th>
              <th class="">Phone</th>
              <th class="">Status</th>
              <th class="">Action</th>
            </tr>
          </thead>
          <tbody style={{ width: "800px" }}>
            {
              loading
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
      </div>
      <UserPagination
        userPerPage={userPerPage}
        totalUsers={totalUsers}
        paginate={paginate}
      />
    </div>
  );
};

export default ManageUsers;