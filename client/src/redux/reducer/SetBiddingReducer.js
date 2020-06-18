import {
  API_START,
  GET_SUBMISSION_AUCT,
  CONFIRM_SUBMISSION,
  API_SUCCESS,
  API_FAILED,
  REJECT_SUBMISSION,
  FILTER_SUBMISSION_BY_STATUS
} from '../Types';

const INITIAL_STATE = {
  submission: [],
  count: 0,
  error: '',
  loading: false
};

export const setBidding = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case API_START:
      return {
        ...state,
        loading: true
      };
    case API_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case API_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case GET_SUBMISSION_AUCT:
      return {
        ...state,
        submission: [...action.payload],
        count: action.count
      };
    case CONFIRM_SUBMISSION:
      return {
        ...state,
        ...action.payload
      };
    case REJECT_SUBMISSION:
      return {
        ...state,
        ...action.payload
      };
    case FILTER_SUBMISSION_BY_STATUS:
      return {
        ...state,
        submission: [...action.payload],
        count: action.count
      };
    default: return state;
  };
};