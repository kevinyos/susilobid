import {
  GET_WALLET_START,
  GET_WALLET_SUCCESS,
  GET_WALLET_FAILED
} from '../Types';

const INITIAL_STATE = {
  loading: false,
  wallet: 0,
  error: ''
};

export const getWalletReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case GET_WALLET_START : 
      return {
        ...state,
        loading: true
      };
    case GET_WALLET_SUCCESS :
      return {
        ...state,
        wallet: action.payload,
        loading: false
      };
    case GET_WALLET_FAILED :
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default : return state;
  };
};