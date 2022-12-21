import React from "react";
import {useLocation, Navigate} from 'react-router-dom'

const ProtectVendorRoute = ({children}) => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("signature");
    const userRole = localStorage.getItem("role");

    if(!isAuthenticated || userRole!== "vendor"){
       return <Navigate to='/login' state={{from:location}}/>
    }
    else{
        return children
    }
}

export default ProtectVendorRoute