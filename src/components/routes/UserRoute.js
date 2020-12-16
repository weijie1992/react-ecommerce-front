import React from "react";
import {Route} from "react-router-dom";
import {useSelector} from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

//dont understand how this works
const UserRoute = ({children, ...rest}) => {
    //console.log("children",children);
    const user = useSelector((state)=>{
        return state.user;
    });
    return user&&user.token ?<Route {...rest} />:<LoadingToRedirect/>
}
export default UserRoute;