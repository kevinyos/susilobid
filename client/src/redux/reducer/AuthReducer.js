import {
    API_AUTH_START,
    API_AUTH_SUCCESS,
    API_AUTH_FAILED,
    LOGIN,
    LOGIN_FAILED,
    LOGOUT,
    VERIFIED
} from '../Types';

const INITIAL_STATE = {
    user_id : 0,
    username : '',
    email : '',
    address : '',
    phone : null,
    role_id : 0,
    loading : false,
    verification_id : null,
    logged : false,
    failedLogin : false,
    status : '',
    error : null,
    verified : false,
    socketId: null
};

export const authReducer = (state = INITIAL_STATE, action) => {
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
        case LOGIN :
            return {
                ...state,
                logged : true,
                ...action.payload
            };
        case LOGIN_FAILED :
            return {
                ...state, 
                failedLogin : !state.failedLogin,
                error : action.payload
            };
        case LOGOUT :
            return INITIAL_STATE;
        case VERIFIED :
            return {
                ...state,
                verified : true
            };
        default :
            return state;
    };
};