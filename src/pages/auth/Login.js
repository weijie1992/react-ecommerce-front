import React,{useState,useEffect} from "react";
import {auth,googleAuthProvider} from "../../firebase";
import {toast} from "react-toastify";
import {Button} from "antd";
import {MailOutlined,GoogleOutlined} from '@ant-design/icons';
import {useDispatch,useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {createOrUpdateUser} from "../../functions/auth";


const Login = (props) => {

    const roleBasedRedirect = (res) => {
        //Check if useris redirected to login page
        let intended = props.history.location.state;
        if(intended) {
            props.history.push(intended.from)
        }
        else {
            if(res.data.role === "admin") {
                props.history.push("/admin/dashboard");
            }
            else {
                props.history.push("/user/history");
            }
        }
    }

    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    //redirect if user already signed in
    const user = useSelector((state)=>{
        return state.user;
    });

    useEffect(()=> {
        //check if user is redirected from other page. props.history.location.state will have a value if it was redirected.
        if(props.history.location.state) {
            return;
        } else {
            if(user&&user.token){
                props.history.push("/");
            }
        }
    },[user,props.history]);

    const handleSubmit = async (e) => {
        e.preventDefault();//prevent browser from reload by default when button was click
        setLoading(true);
        try {
            //client side firebase password authentication
            const result = await auth.signInWithEmailAndPassword(email,password);
            console.log("Client Side Authentication with firebase", result);
            const {user} = result; //user = result.user
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
            .then((res)=>{
                console.log("Server Side Authentication with firebase PASSWORD: ", res);
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
                roleBasedRedirect(res);
            })
            .catch(err=>console.log(err)); //catch for createOrUpdateUser
        }
        catch (error) {//catch for signInWithEmailAndPassword
            console.log(error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    const googleLogin = async () => {
        //client side firebase google authentication
        auth.signInWithPopup(googleAuthProvider)
        .then(async (result) => {
            console.log("Client Side Authentication with firebase GOOGLE: ", result);
            const {user} = result;//user = result.user
            const idTokenResult = await user.getIdTokenResult();

            createOrUpdateUser(idTokenResult.token)
            .then((res)=> {
                console.log("Server Side Authentication with firebase GOOGLE: ", res);
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
                roleBasedRedirect(res);
            }).catch(err=>console.log(err)); //catch for createOrUpdateUser           
        }).catch(error => { //catch for signInWithPopup
            toast.error(error.message);
            console.log(error);
        }); 
    }
    const loginForm = () => {
        return(
            <form>
                <div className="form-group">
                    <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="form-control" 
                    value={email} 
                    onChange={(e)=>{return setEmail(e.target.value)}} 
                    autoFocus
                    />
                </div>

                <div className="form-group">
                    <input 
                    type="password" 
                    placeholder="Enter your password"
                    className="form-control" 
                    value={password} 
                    onChange={(e)=>{return setPassword(e.target.value)}}
                    />
                </div>
                
                <br/> 

                <Button
                onClick={handleSubmit}
                type="primary"
                block
                shape="round"
                icon={<MailOutlined/>}
                size="large"
                disabled={!email||password.length<6}
                className="mb-3">
                    Login with Email/Password
                </Button>
            </form>
        )
    };
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading?<h4 className="text-danger">Loading</h4>:<h4>Login</h4>}

                    {loginForm()}

                    <Button
                    onClick={googleLogin}
                    type="danger"
                    className="mb-3"
                    block
                    shape="round"
                    icon={<GoogleOutlined/>}
                    size="large"
                    >
                    Login with Google
                    </Button>

                    <Link to="/forgot/password" className="float-right text-danger">Forget Password</Link>
                </div>    
            </div> 
        </div>
    )
}
export default Login;