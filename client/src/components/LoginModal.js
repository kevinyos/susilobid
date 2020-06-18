import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { Login, LoginFailed } from '../redux/action';

// modal & style
import { Modal } from 'react-bootstrap';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';

const LoginModal = props => {

  const [formInput, setForm] = useState({
    username: '',
    password: ''
  });

  const dispatch = useDispatch();

  const failedLogin = useSelector(({auth}) => auth.failedLogin);
  const loading = useSelector(({ auth }) => auth.loading);
  const role = useSelector(({ auth }) => auth.role_id);
  const error = useSelector(({ auth }) => auth.error);
  
  const handleChange = e => {
    setForm({
      ...formInput,
      [e.target.name]: e.target.value
    });
  };

  const handleBtn = () => {
    let { username, password } = formInput;
    dispatch(Login(username, password));
  };

  const renderModal = () => {
    return (
      <div>
        {
          !failedLogin
            ?
            <>
              <Modal.Body>
                <Grid textAlign='center' style={{ height: '65vh' }} verticalAlign='middle'>
                  <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                      Login
                    </Header>
                    <Form size='large'>
                      <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' name='username' placeholder='Username' onChange={handleChange} />
                        <Form.Input
                          fluid
                          icon='lock'
                          iconPosition='left'
                          name='password'
                          placeholder='Password'
                          type='password'
                          onChange={handleChange}
                        />
                        <Link to='/'>
                          <Button color='teal' fluid size='large' onClick={handleBtn}>
                            {
                              loading
                              ?
                              <Loader type="Circles" color="#009C95" height={20} width={20} />
                              :
                              'Login'
                            }
                          </Button>
                        </Link>
                      </Segment>
                    </Form>
                    <Message>
                      Do not have SusiloBid account? <Link to='/register' style={{ textDecoration: 'none', color: '#009C95' }} onClick={props.onHide}>Sign Up </Link>
                    </Message>
                  </Grid.Column>
                </Grid>
              </Modal.Body>
            </>
            :
            <>
              <Modal.Header className='d-flex justify-content-center'>
                <Modal.Title className='text-center' style={{ color: '#009C95' }}>Login Failed</Modal.Title>
              </Modal.Header>
                <Modal.Body className='d-flex justify-content-center h2'>{error}</Modal.Body>
              <Modal.Footer className='d-flex justify-content-center'>
                <Button className='ui teal basic button' onClick={() => dispatch(LoginFailed())}>
                  Try Again
                </Button>
                <Link to='/register'>
                  <Button className='ui teal button' onClick={props.onHide}>
                    Register
                  </Button>
                </Link>
              </Modal.Footer>
            </>
        }
        {
          role === 1
          ?
          <Redirect to = '/internal' />
          :
          <Redirect to = '/' />
        }
      </div>
    );
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton />
      {renderModal()}
    </Modal>
  );
};

export default LoginModal;