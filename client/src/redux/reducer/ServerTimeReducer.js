import {
  API_START,
  GET_SERVER_TIME,
  API_SUCCESS,
  API_FAILED
} from '../Types';

const INITIAL_STATE = {
  loading: false,
  time: null,
  error: ''
};

export const getServerTime = (state = INITIAL_STATE, action) => {
  switch(action.type){
    case API_START :
      return {
        ...state,
        loading: true
      };
    case GET_SERVER_TIME :
      return {
        ...state,
        time: action.payload
      };
      case API_SUCCESS :
        return {
          ...state,
          loading: false
        };
      case API_FAILED :
        return {
          ...state,
          error: action.payload
        };
      default : return state;
  };
};