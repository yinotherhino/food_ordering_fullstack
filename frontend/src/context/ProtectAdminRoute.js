import React from "react";
import {useLocation, Navigate} from 'react-router-dom'

const ProtectAdminRoute = ({children}) => {
    const location = useLocation();
    const isAuthenticated = localStorage.getItem("signature");
    const userRole = localStorage.getItem("role");

    if(!isAuthenticated || userRole!== "admin" || userRole!== "superadmin"){
       return <Navigate to='/login' state={{from:location}}/>
    }
    else{
        return children
    }
}

export default ProtectAdminRoute