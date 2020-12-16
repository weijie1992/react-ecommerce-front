import React, {useEffect,useState} from "react";
import {Route} from "react-router-dom";
import {useSelector} from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import {currentAdmin} from "../../functions/auth";

//dont understand how this works
const AdminRoute = ({children, ...rest}) => {
    console.log("children",children);
    const user = useSelector((state)=>{
        return state.user;
    });
    const [ok, setOk] = useState(false);

    //the 2nd parameter [user] dependency will run whenever user state changes
    useEffect(()=> {
        if(user&&user.token) {
            currentAdmin(user.token)
            .then((res)=> {
                console.log("Current Admin Response : ", res);
                setOk(true);
            })
            .catch((err)=>
            {
                console.log("Current Admin Error : ", err);
                setOk(false);
            })
        }
    },[user]);

    return ok ? (<Route {...rest} /> ): (<LoadingToRedirect/>)
}
export default AdminRoute;