import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
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

export const GetAllUsers = (userPerPage, offset) => {
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.get(`${API_URL}/manage-users/get-users/${userPerPage}/${offset}`);
            // console.log(res.data.data)
            // console.log(res.data.count)
            dispatch({
                type : GET_ALL_USERS,
                payload : res.data.data,
                count : res.data.count
            });
            dispatch({
                type : API_AUTH_SUCCESS
            });
        } catch(err) {
            dispatch({
                type : API_AUTH_FAILED,
                payload : err
            });
        };
    };
};

export const FilterUserByStatus = (userPerPage, offset, status) => {
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.get(`${API_URL}/manage-users/filter-by-status/${userPerPage}/${offset}/${status}`);
            dispatch({
                type : FILTER_USER_BY_STATUS,
                payload : res.data.data,
                count : res.data.count
            });
            dispatch({
                type : API_AUTH_SUCCESS
            });
        } catch(err) {
            dispatch({
                type : API_AUTH_FAILED,
                payload : err
            });
        };
    };
};

export const SearchUser = (email, userPerPage, offset) => {
    // console.log(email)
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.post(`${API_URL}/manage-users/search-users/${email}/${userPerPage}/${offset}`);
            // console.log(res.data)
            dispatch({
                type : SEARCH_USER_BY_EMAIL,
                payload : res.data.data,
                count : res.data.count
            });
            dispatch({
                type : API_AUTH_SUCCESS
            });
        } catch(err) {
            dispatch({
                type : API_AUTH_FAILED,
                payload : err.response
            });
        };
    };
};

export const BanUser = id => {
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.post(`${API_URL}/manage-users/ban-users/${id}`);
            // console.log(res.data)
            dispatch({
                type : BAN_USER,
                payload : res.data
            });
            dispatch({
                type : API_AUTH_SUCCESS
            });
        } catch(err) {
            dispatch({
                type : API_AUTH_FAILED,
                payload : err.response
            });
        };
    };
};

export const UnbanUser = id => {
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.post(`${API_URL}/manage-users/unban-users/${id}`);
            // console.log(res.data)
            dispatch({
                type : UNBAN_USER,
                payload : res.data
            });
            dispatch({
                type : API_AUTH_SUCCESS
            });
        } catch(err) {
            dispatch({
                type : API_AUTH_FAILED,
                payload : err.response
            });
        };
    };
};