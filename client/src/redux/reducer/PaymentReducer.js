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

const INITIAL_STATE = {
  loading: false,
  message: '',
  data: [],
  count: 0,
  error: ''
};

export const addTopupReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case API_PAYMENT_START :
      return {
        ...state,
        loading: true
      };
    case ADD_TOPUP_SUCCESS :
      return {
        ...state,
        message: action.payload,
        loading: false
      };
    case GET_TOPUP :
      return {
        ...state,
        data: [...action.payload],
        count: action.count,
        loading: false
      };
    case FILTER_PAYMENT_BY_STATUS :
      return {
        ...state,
        data: [...action.payload],
        count: action.count,
        loading: false
      };
    case FILTER_PAYMENT_BY_USERNAME :
      return {
        ...state,
        data: [...action.payload],
        count: action.count,
        loading: false
      };
    case REJECT_TOPUP :
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case CONFIRM_TOPUP :
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case API_PAYMENT_FAILED : 
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default : return state;
  };
};