import React from 'react';
import { Link } from 'react-router-dom';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { Logout } from '../redux/action';

// style
import { Modal, Container, Row, Col } from 'react-bootstrap';
import NoName from '../asset/no_profile.jpg';
import { FaSignOutAlt } from "react-icons/fa";
import './ProfileModal.css';

const ProfileModal = props => {

    const dispatch = useDispatch();

    const gState = useSelector(({ auth }) => {
        return {
            uName: auth.username
        };
    });

    const { uName } = gState;

    return (
        <Modal 
            {...props}
            className="myModal"
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            onClick={props.onHide}
        >
            <Modal.Header className='d-flex align-items-center' style={{ height: '15vh' }} closeButton> 
                <img src={NoName} alt='No Pic' style={{ width: '8.5rem', height: '6.5rem' }}/>
                <p className='h4' style={{ color: '#009C95' }}>{uName}</p>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className='show-grid'>
                        <Col xs={4} md={8}>
                            <p style={{ color:'#939393' }}>Wallet Cash :</p>
                        </Col>
                        <Col xs={8} md={4}>
                            <p style={{ color:'#939393' }}>0 Rp</p>
                        </Col>
                        <Col xs={12} md={12} className='mt-3'>
                            <Link style={{ textDecoration:'none', color:'#939393' }}><p>Edit Profile</p></Link>
                        </Col>
                        <Col xs={12} md={12} className='mt-3'>
                            <Link to='/' style={{ textDecoration:'none', color:'#939393' }}><p onClick={() => dispatch(Logout())}>Log Out <FaSignOutAlt className='ml-2'/></p></Link>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default ProfileModal;