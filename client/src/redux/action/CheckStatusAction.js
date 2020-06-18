import Axios from 'axios';
import { API_URL } from '../../support/API_URL';

import { 
    API_AUTH_START,
    CHECK_STATUS,
    API_AUTH_SUCCESS,
    API_AUTH_FAILED 
} from '../Types';

export const checkStatus = id => {
    // console.log(id)
    return async dispatch => {
        try {
            dispatch({
                type : API_AUTH_START
            });
            let res = await Axios.get(`${API_URL}/manage-users/check-status/${id}`);
            // console.log(res.data)
            dispatch({
                type : CHECK_STATUS,
                payload : res.data[0].status
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