import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
import {
  API_PAYMENT_START,
  ADD_TOPUP_SUCCESS,
  GET_TOPUP,
  FILTER_PAYMENT_BY_STATUS,
  FILTER_PAYMENT_BY_USERNAME,
  REJECT_TOPUP,
  CONFIRM_TOPUP,
  API_PAYMENT_FAILED
} from '../Types'; 

export const AddTopup = (id, nominal) => {
  return async dispatch => {
    dispatch({
      type: API_PAYMENT_START
    });
    try {
      let res = await Axios.post(`${API_URL}/payment/topup/${id}`, nominal);
      dispatch({
        type: ADD_TOPUP_SUCCESS,
        payload: res.data.message
      });
    } catch(err) {
      dispatch({
        type: API_PAYMENT_FAILED,
        payload: err
      });
    }
  };
};

export const GetTopup = (topupPerPage, offset, render) => {
  return async dispatch => {
    dispatch({
      type: API_PAYMENT_START
    });
    try {
      let res = await Axios.get(`${API_URL}/payment/get-topup/${topupPerPage}/${offset}/${render}`);
      dispatch({
        type: GET_TOPUP,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: API_PAYMENT_FAILED,
        payload: err
      });
    }
  };
};

export const RejectTopup = (trxId, notes) => {
  return async dispatch => {
    dispatch({
      type: API_PAYMENT_START
    });
    try {
      let res = await Axios.post(`${API_URL}/payment/reject-topup/${trxId}/${notes}`);
      dispatch({
        type: REJECT_TOPUP,
        payload: res.data.message
      });
    } catch(err) {
      dispatch({
        type: API_PAYMENT_FAILED,
        payload: err
      });
    }
  };
};

export const ConfirmTopup = (trxId, userId, amount) => {
  return async dispatch => {
    dispatch({
      type: API_PAYMENT_START
    });
    try {
      let res = await Axios.post(`${API_URL}/payment/confirm-topup/${trxId}/${userId}/${amount}`);
      dispatch({
        type: CONFIRM_TOPUP,
        payload: res.data
      });
    } catch(err) {
      console.log(err);
      dispatch({
        type: API_PAYMENT_FAILED,
        payload: err
      });
    }
  };
};

export const FilterPaymentByStatus = (topupPerPage, offset, render) => {
  return async dispatch => {
    try {
      dispatch({
        type: API_PAYMENT_START
      });
      let res = await Axios.get(`${API_URL}/payment/filter-by-status/${topupPerPage}/${offset}/${render}`)
      dispatch({
        type: FILTER_PAYMENT_BY_STATUS,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: API_PAYMENT_FAILED,
        payload: err
      });
    }
  };
};

export const FilterPaymentByUsername = (username, topupPerPage, offset) => {
  return async dispatch => {
    try {
      dispatch({
        type: API_PAYMENT_START
      });
      let res = await Axios.get(`${API_URL}/payment/filter-by-username/${username}/${topupPerPage}/${offset}`);
      dispatch({
        type: FILTER_PAYMENT_BY_USERNAME,
        payload: res.data.data,
        count: res.data.count
      });
    } catch(err) {
      dispatch({
        type: API_PAYMENT_FAILED,
        payload: err
      });
    }
  };
};