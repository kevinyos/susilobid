import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
import {
  API_START,
  GET_SUBMISSION_AUCT,
  API_SUCCESS,
  API_FAILED,
  CONFIRM_SUBMISSION,
  REJECT_SUBMISSION,
  FILTER_SUBMISSION_BY_STATUS
} from '../Types';

export const GetSubmissionAuct = (submissionPerPage, offset, render) => {
  return async dispatch => {
    try {
      dispatch({
        type: API_START
      });
      let res = await Axios.get(`${API_URL}/set-bidding-room/get-submission-auct/${submissionPerPage}/${offset}/${render}`);
      // console.log(res.data);
      dispatch({
        type: GET_SUBMISSION_AUCT,
        payload: res.data.data,
        count: res.data.count
      });
      dispatch({
        type: API_SUCCESS
      });
    } catch (err) {
      dispatch({
        type: API_FAILED,
        payload: err
      });
    };
  };
};

export const ConfirmSubmission = id => {
  return async dispatch => {
    try {
      dispatch({
        type: API_START
      });
      let res = await Axios.post(`${API_URL}/set-bidding-room/confirm-submission/${id}`);
      // console.log(res.data)
      dispatch({
        type: CONFIRM_SUBMISSION,
        payload: res.data
      });
      dispatch({
        type: API_SUCCESS
      });
    } catch(err) {
      dispatch({
        type: API_FAILED,
        payload: err
      });
    }
  };
};

export const RejectSubmission = (id, notes) => {
  return async dispatch => {
    try {
      dispatch({
        type: API_START
      });
      let res = await Axios.post(`${API_URL}/set-bidding-room/reject-submission/${id}/${notes}`);
      dispatch({
        type: REJECT_SUBMISSION,
        payload: res.data
      });
      dispatch({
        type: API_SUCCESS
      });
    } catch(err) {
      dispatch({
        type: API_FAILED,
        payload: err
      });
    };
  };
};

export const FilterSubmissionByStatus = (submissionPerPage, offset, render) => {
  return async dispatch => {
    try {
      dispatch({
        type: API_START
      });
      let res = await Axios.post(`${API_URL}/set-bidding-room/filter-by-status/${submissionPerPage}/${offset}/${render}`);
      // console.log(res.data)
      dispatch({
        type: FILTER_SUBMISSION_BY_STATUS,
        payload: res.data.data,
        count: res.data.count
      });
      dispatch({
        type: API_SUCCESS
      });
    } catch(err) {
      dispatch({
        type: API_FAILED
      });
    };
  };
};