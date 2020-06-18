import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
import {
  API_START,
  GET_SERVER_TIME,
  API_SUCCESS,
  API_FAILED
} from '../Types';

export const GetServerTime = () => {
  return async dispatch => {
    try {
      dispatch({
        type: API_START
      });
      let res = await Axios.get(`${API_URL}/get-server-time`);
      // console.log(res.data)
      dispatch({
        type: GET_SERVER_TIME,
        payload: res.data
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