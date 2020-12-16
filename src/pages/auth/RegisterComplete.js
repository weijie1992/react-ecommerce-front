import React,{useEffect, useState} from "react";
import {auth} from '../../firebase';
import {toast} from "react-toastify";
import {useDispatch,useSelector} from "react-redux";
import {createOrUpdateUser} from "../../functions/auth";

const RegisterComplete = (props) => {

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    
    const dispatch = useDispatch();
    const user = useSelector((state)=> {
        return state.user
    });
    //get email from from local storage
    //only useful when signing in within the same device because it is save in local storage
    useEffect(()=>{
        if(user&&user.token){
            props.history.push("/");
        }
        setEmail(window.localStorage.getItem("emailForRegistration"));
        //console.log(window.location.href);

    },[user,props.history]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        //validation
        if(!email||!password) {
            toast.error("Email and Pasword is required");
            return;
        }
        if(password.length < 6) {
            toast.error("Password must be at least 6 character long");
            return;
        }
        //Log 
        try {
            //signInWithEmail require 2 parameter email and the callback url by google firebase with can get from window.location.href noted that password have not been save at this point
            const result = await auth.signInWithEmailLink(email, window.location.href);
            if(result.user.emailVerified) {
                //remove email from local storage, as not needed anymore.
                window.localStorage.removeItem("emailForRegistration");
                //get user id token for JWT to server
                //auth from firebase have a currentUser property which is the current logged in user.
                let user = auth.currentUser;
                //firebase updatePassword function
                await user.updatePassword(password);
                console.log("Client Side Authentication with firebase COMPLETE REG: ", user);
                //get current login user token for server 
                const idTokenResult = await user.getIdTokenResult();
                 //Updateing server with registered user
                createOrUpdateUser(idTokenResult.token)
                .then((res) => {
                    console.log("Server Side Authentication with firebase COMPLETE REG: ", res);
                    dispatch({  
                        type:"LOGGED_IN_USER",
                        payload: {
                            name:res.data.name,
                            email:res.data.email,
                            token:idTokenResult.token,
                            role:res.data.role,
                            _id: res.data._id
                        }
                    });
                }).catch(err=>console.log(err));

                //redux store
                console.log("user : ", user, "idTokenResult : ", idTokenResult)
                //redirect to 
                props.history.push("/");

            }
        }
        catch (error) {
            toast.error(error.message)
        }
    };

    const CompleteRegistrationForm = () => {
        return(
            <form onSubmit={handleSubmit}>
                <input 
                type="email" 
                className="form-control" 
                value={email} 
                disabled
                />
                <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e)=>{return setPassword(e.target.value)}}
                autoFocus
                placeholder="Enter new password"
                />
                <br/>
                <button
                type="submit"
                className="btn btn-raised">
                    Complete Registration
                </button>
            </form>
        )
    };
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register Complete</h4>
                    
                    {CompleteRegistrationForm()}
                </div>    
            </div> 
        </div>
    )
}
export default RegisterComplete;