import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
import {
  API_AUTH_START,
  API_AUTH_SUCCESS,
  API_AUTH_FAILED,
  LOGIN,
  LOGOUT,
  VERIFIED,
  MODAL_SHOW,
  LOGIN_FAILED
} from '../Types';

export const Register = form => {
  return dispatch => {
    dispatch({
      type: API_AUTH_START
    });
    Axios.post(`${API_URL}/users/register`, form)
      .then(res => {
        // console.log(res.data)
        let { user_id, username, email, address, phone, role_id, token, verification_id, status } = res.data.data;
        dispatch({
          type: LOGIN,
          payload: {
            user_id,
            username,
            email,
            address,
            phone,
            role_id,
            verification_id,
            status
          }
        });
        localStorage.setItem('token', token);
        dispatch({
          type: API_AUTH_SUCCESS
        });
      })
      .catch(err => {
        dispatch({
          type: API_AUTH_FAILED
        });
      });
  };
};

export const Login = (username, password) => {
  return dispatch => {
    Axios.post(`${API_URL}/users/login/`, { username, password })
      .then(res => {
        // console.log(res.data.status)
        let { user_id, username, email, address, phone, role_id, token, verification_id, status } = res.data.data;
        // console.log(typeof(res.data))
        dispatch({
          type: LOGIN,
          payload: {
            user_id,
            username,
            email,
            address,
            phone,
            role_id,
            verification_id,
            status
          }
        });
        dispatch({
          type: MODAL_SHOW
        });
        localStorage.setItem('token', token);
        dispatch({
          type: API_AUTH_SUCCESS
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: LOGIN_FAILED,
          payload: err.response.data.message
        });
        dispatch({
          type: API_AUTH_FAILED,
          payload: err.response.data.message
        });
      });
  };
};

export const keepLogin = token => {
    // console.log(id)
    return async dispatch => {
        let token = localStorage.getItem('token');
        // console.log(token)
        try{        
            if (token) {
                dispatch({
                    type : API_AUTH_START
                });
                let headers = {
                    headers : {
                        'Authorization' : `Bearer ${token}`
                    }
                };
                let res = await Axios.post(`${API_URL}/users/keep-login`, {}, headers);
                // console.log(res.data)
                let { user_id, username, email, address, phone, role_id, verification_id, wallet, status } = res.data.data;
                dispatch({
                    type : LOGIN,
                    payload : {
                        user_id,
                        username, 
                        email,
                        address,
                        phone,
                        role_id,
                        verification_id,
                        wallet,
                        status,
                        logged : true
                    }
                });
                // console.log(status)
                dispatch({
                    type : API_AUTH_SUCCESS
                });
            };
        }catch(err){
            dispatch({
                type : API_AUTH_FAILED
            });
        };
    };
};

export const Verification = form => {
  return async dispatch => {
    dispatch({
      type: API_AUTH_START
    });
    try {
      let res = await Axios.post(`${API_URL}/users/verification`, form);
      // true res.data.data
      dispatch({
        type: VERIFIED,
        payload: res.data.data
      });
      dispatch({
        type: API_AUTH_SUCCESS
      });
    } catch (err) {
      dispatch({
        type: API_AUTH_FAILED,
        payload: err.response
      });
    };
  };
};

export const LoginFailed = () => {
  return dispatch => {
    dispatch({
      type: LOGIN_FAILED
    });
  };
};

export const Logout = () => {
  return dispatch => {
    localStorage.removeItem('token')
    dispatch({
      type: LOGOUT
    });
  };
};

