import {
    API_AUTH_START,
    CHECK_STATUS,
    API_AUTH_SUCCESS,
    API_AUTH_FAILED
} from '../Types';

const INITIAL_STATE = {
    loading : false,
    status : '',
    error : ''
}

export const checkStatusReducer = (state = INITIAL_STATE, action) => {
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
        case CHECK_STATUS :
            return {
                ...state,
                status : action.payload
            };
        case API_AUTH_FAILED :
            return {
                ...state,
                loading : false,
                error : action.payload
            }
        default : return state
    };
};