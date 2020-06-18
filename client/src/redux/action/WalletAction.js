import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
import { GET_WALLET_START, GET_WALLET_SUCCESS, GET_WALLET_FAILED } from '../Types';

export const WalletAction = userId => {
  return async dispatch => {
    try {
      dispatch({
        type: GET_WALLET_START
      });
      let res = await Axios.get(`${API_URL}/wallet/get-wallet/${userId}`);
      
      dispatch({
        type: GET_WALLET_SUCCESS,
        payload: res.data.data[0].wallet
      });
    } catch(err) {
      dispatch({
        type: GET_WALLET_FAILED,
        payload: err.message
      });
    }
  };
};