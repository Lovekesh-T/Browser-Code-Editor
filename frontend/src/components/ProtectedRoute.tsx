import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface ProctectedRouteProps{
    redirect:string;
    isAuthenticated:boolean;
    children?:ReactElement
}

const ProtectedRoute = ({redirect,isAuthenticated,children}:ProctectedRouteProps)=> {
    return (
        <>
        {isAuthenticated ? children : <Navigate to={redirect}/>}
        </>
    )
}

export default ProtectedRoute
