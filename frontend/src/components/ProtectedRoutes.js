import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import axios from "axios";

function ProtectedRoutes({ children }) {
    
    const location = useLocation();
    let loggedin = false;
    let token = localStorage.getItem('access_token');
    let expire = localStorage.getItem('expiry_date');
    let refresh = localStorage.getItem('refresh_token');
    let last_refresh = localStorage.getItem('last_refresh');
    // if(!token || !expire) {
    //     loggedin = false;
    // }
    // else {
    //     loggedin = expire - Date.now() > 0;
    // }
    if (!token || !expire) {
        loggedin = false;
    }
    else {
        console.log("expire: ", expire - Date.now());

        if (expire - Date.now() > 0) {
            loggedin = true;

        }
        else {
            console.log("last refresh: ", last_refresh - Date.now());
            if (last_refresh - Date.now() > 0) {
                axios.post('http://127.0.0.1:8000/api/user/token/refresh/', { refresh: refresh })
                    .then((response) => {
                        console.log(response);
                        token = localStorage.setItem('access_token', response.data.access);
                        refresh = localStorage.setItem('refresh_token', response.data.refresh);
                        expire = localStorage.setItem('expiry_date', Date.now() + 3600000);
                        loggedin = true;
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }
        loggedin = expire - Date.now() > 0 || last_refresh - Date.now() > 0;
    }
    return (loggedin ? <>{children}</> : <Navigate to={'/login'} state={{ from: `${location.pathname}` }}></Navigate>);
}
export default ProtectedRoutes;