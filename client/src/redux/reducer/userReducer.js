import {
    API_AUTH_START,
    API_AUTH_SUCCESS, 
    GET_ALL_USERS,
    BAN_USER,
    UNBAN_USER,
    SEARCH_USER_BY_EMAIL,
    FILTER_USER_BY_STATUS,
    API_AUTH_FAILED 
} from '../Types';

const INITIAL_STATE = {
    loading : false,
    data : [],
    count : 0,
    error : ''
};

export const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case API_AUTH_START :
            return {
                ...state,
                loading : true
            };
        case API_AUTH_SUCCESS : 
            return {
                ...state,
                loading : false
            };
        case API_AUTH_FAILED :
            return {
                ...state,
                loading : false,
                error : action.payload
            };
        case GET_ALL_USERS :
            return {
                ...state,
                data : [...action.payload],
                count : action.count
            }
        case SEARCH_USER_BY_EMAIL :
            return {
                ...state,
                data : [...action.payload],
                count : action.count
            };
        case FILTER_USER_BY_STATUS :
            return {
                ...state,
                data : [...action.payload],
                count : action.count
            };
        case BAN_USER :
            return {
                ...state,
                ...action.payload
            };
        case UNBAN_USER :
            return {
                ...state,
                ...action.payload
            };
        default : return state;
    };
};