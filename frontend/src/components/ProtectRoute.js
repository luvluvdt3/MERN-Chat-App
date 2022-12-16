import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({children}) => {
     const {authenticate} = useSelector(state=>state.auth); //check if the user is logged in through variable authenticate of authState in authReducer declared in /store/index.js
     return authenticate ? children : <Navigate to="/messenger/login" />
    //  if not logged in then go to Login page
};

export default ProtectRoute;