import React,{useState}from "react";
import {Link} from "react-router-dom";
import {Menu,Badge} from "antd";
import {AppstoreOutlined, SettingOutlined,UserOutlined,UserAddOutlined,LogoutOutlined,ShoppingOutlined,ShoppingCartOutlined } from '@ant-design/icons';
import firebase from "firebase"; //for logout function
import {useDispatch,useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Search from "../forms/Search";

const { SubMenu,Item } = Menu; //Menu.subMenu destructing



const Header = () => {
    const dispatch = useDispatch();

    
    // let user = useSelector((state)=>{
    //     return state.user
    // });
    //get user state and cart state
    let {user,cart} = useSelector((state) => {
        return ({...state})
    });

    const history = useHistory();

    const [current, setCurrent] = useState("");

    const  handleClick = (event) => {
        console.log(event.key);
        setCurrent(event.key);
    };
    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type:"LOGOUT",
            payload:null
        });
        history.push("/login");
    }
    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<AppstoreOutlined />} >
                <Link to="/">Home</Link>
            </Item>
            <Item key="shop" icon={<ShoppingOutlined />} >
                <Link to="/shop">Shop</Link>
            </Item>
            <Item key="cart" icon={<ShoppingCartOutlined />} >
                <Link to="/cart"><Badge count={cart.length} offset={[9,0]}>Cart</Badge></Link>
            </Item>
            {/* if user state is null then show register and login*/}
            {!user && <Item key="register" icon={<UserAddOutlined />} className="float-right">
                <Link to="/Register">Register</Link>
            </Item>
            }
            {!user && <Item key="login" icon={<UserOutlined />} className="float-right">
                <Link to="/Login">Login</Link>
            </Item>}
            {/* if user state is not null(logged in) show username nav bar */}
            {user && (<SubMenu 
            key="SubMenu" 
            icon={<SettingOutlined />} 
            className="float-right"
            title={user.email && user.email.split("@")[0]}
            >
                {user && user.role==="subscriber" && 
                <Item>
                    <Link to="/user/history">Dashboard</Link>
                </Item>
                }
                {user && user.role==="admin" && 
                <Item>
                    <Link to="/admin/dashboard">Dashboard</Link>
                </Item>
                }
                <Item icon={<LogoutOutlined/>} onClick={logout}>Logout</Item>
            </SubMenu>)}
            <span className="float-right p-1"><Search/></span>
        </Menu>
    );
}

export default Header