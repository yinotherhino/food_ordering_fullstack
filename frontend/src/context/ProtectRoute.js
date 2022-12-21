import React from "react";
import {useLocation, Navigate} from 'react-router-dom'

const ProtectRoute = ({children}) => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("signature");

    if(!isAuthenticated){
       return <Navigate to='/login' state={{from:location}}/>
    }
    else{
        return children
    }
}

export default ProtectRoute
