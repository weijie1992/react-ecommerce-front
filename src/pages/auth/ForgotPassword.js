import React,{useState,useEffect} from "react";
import {useSelector} from "react-redux";
import {auth} from "../../firebase";
import {toast} from "react-toastify";

const ForgotPassword = (props) => {
    const [email,setEmail] = useState("");
    const [loading,setLoading] = useState(false);

    //redirect if user already signed in
    const user = useSelector((state)=>{
        return state.user;
    });
    useEffect(()=> {
        if(user&&user.token){
            props.history.push("/");
        }
    },[user,props.history]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        //send password link using firebase
        const config = {
            url:process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
            handleCodeInApp:true
        };
        await auth.sendPasswordResetEmail(email,config)
        .then(()=> {
            setEmail("");
            setLoading(false);
            toast.success("Password link have been send to your email");

        })
        .catch((error)=> {
            setLoading(false);
            toast.error(error.message);
            console.log("Error in forgotPassword : ", error);
        });
    };
    return (
        <div className="container col-md-6 offset md-3 p-5">
            {loading?<h4 className="text-danger">Loading</h4>:<h4>Forgot Password</h4>} 
           
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e)=>{return setEmail(e.target.value)}}
                placeholder="Enter your email"
                autoFocus
                />
                <br/>
                <button
                className="btn btn-raised"
                disabled={!email}
                >
                    Submit
                </button>
            </form>
        </div>
        
    );

}

export default ForgotPassword;