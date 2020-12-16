import React,{useState,useEffect} from "react";
import {auth} from '../../firebase';
import {toast} from "react-toastify";
import {useSelector} from "react-redux";


const Register = (props) => {
    const [email, setEmail] = useState("");

    //redirect if user already signed in
    const user = useSelector((state)=>{
        return state.user;
    });
    useEffect(()=> {
        console.log("useeffect in register");
        if(user&&user.token){
            props.history.push("/");
        }
    },[user,props.history]);

    const handleSubmit = async (e) => {
        e.preventDefault();//prevent browser from reload by default when button was click
        const config = {
            url:process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp:true
        };
        //Send sign in config to Email. Firebase will send a email url which specify in config.url to the user Email. 
        await auth.sendSignInLinkToEmail(email,config);
        toast.success(`Email is sent to ${email}. Click the link to complete your registration`);
        //Save user email in local storage
        window.localStorage.setItem("emailForRegistration",email);
        //clear email form
        setEmail("");
    };

    const registerForm = () => {
        return(
            <form onSubmit={handleSubmit}>
                <input 
                type="email" 
                placeholder="Enter your email"
                className="form-control" 
                value={email} 
                onChange={(e)=>{return setEmail(e.target.value)}} 
                autoFocus
                />
                <br/>
                <button
                type="submit"
                className="btn btn-raised">
                    Register
                </button>
            </form>
        )
    };
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    
                    {registerForm()}
                </div>    
            </div> 
        </div>
    )
}
export default Register;