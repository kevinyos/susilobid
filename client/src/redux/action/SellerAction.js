import Axios from 'axios';
import { API_URL } from '../../support/API_URL';
import {
    API_AUTH_START,
    API_AUTH_SUCCESS, 
    GET_ALL_SELLERS,
    BAN_SELLER,
    UNBAN_SELLER,
    SEARCH_SELLER_BY_EMAIL,
    FILTER_SELLER_BY_STATUS,
    API_AUTH_FAILED 
} from '../Types';

export const GetAllSellers = (sellerPerPage, offset) => {
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.get(`${API_URL}/manage-sellers/get-sellers/${sellerPerPage}/${offset}`);
            console.log(res.data)
            dispatch({
                type : GET_ALL_SELLERS,
                payload : res.data.data,
                count: res.data.count
            });
            dispatch({
                type : API_AUTH_SUCCESS
            });
        } catch(err) {
            dispatch({
                type : API_AUTH_FAILED,
                payload : err.response.data.message
            });
        };
    };
};

export const FilterSellerByStatus = (sellerPerPage, offset, status) => {
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.get(`${API_URL}/manage-sellers/filter-by-status/${sellerPerPage}/${offset}/${status}`);
            dispatch({
                type : FILTER_SELLER_BY_STATUS,
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

export const SearchSeller = (email, sellerPerPage, offset) => {
    // console.log(email)
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.post(`${API_URL}/manage-sellers/search-sellers/${email}/${sellerPerPage}/${offset}`);
            // console.log(res.data)
            dispatch({
                type : SEARCH_SELLER_BY_EMAIL,
                payload : res.data.data,
                count: res.data.count
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

export const BanSeller = id => {
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.post(`${API_URL}/manage-sellers/ban-sellers/${id}`);
            // console.log(res.data)
            dispatch({
                type : BAN_SELLER,
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

export const UnbanSeller = id => {
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.post(`${API_URL}/manage-sellers/unban-sellers/${id}`);
            // console.log(res.data)
            dispatch({
                type : UNBAN_SELLER,
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