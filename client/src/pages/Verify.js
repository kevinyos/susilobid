import React, { useEffect } from 'react';
import queryString from 'querystring';
import { Redirect } from 'react-router-dom'

// redux
import { useDispatch, useSelector } from 'react-redux';
import { Verification } from '../redux/action';

const Verify = props => {

    let params = queryString.parse(props.location.search);
    let username = params["?username"];
    let password = params.password;
    // console.log(props)

    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            Verification({
                username,
                password
            })
        );
    });

    const gState = useSelector(({ auth }) => {
        return {
            verif : auth.verified,
            error : auth.error
        };
    });

    const { verif, error } = gState

    if (verif) {
        return (
            <Redirect to='/'/>
        );
    };
    
    return ( 
        <div>
            {
                error
                ?
                error.data
                :
                'Verify'
            }
        </div>
    );
};

export default Verify;