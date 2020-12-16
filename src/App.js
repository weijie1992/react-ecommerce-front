import React, { Fragment,useEffect,lazy,Suspense} from "react";
import "react-toastify/dist/ReactToastify.css";
import {Switch, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {auth} from "./firebase";
import {useDispatch} from "react-redux";
import {currentUser} from "./functions/auth";
import {LoadingOutlined} from "@ant-design/icons";
// import {Switch, Route} from "react-router-dom";
// import UserRoute from "./components/routes/UserRoute";
// import AdminRoute from "./components/routes/AdminRoute";
// import Home from "./pages/Home";
// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import Header from "./components/nav/Header"
// import RegisterComplete from "./pages/auth/RegisterComplete"
// import ForgotPassword from "./pages/auth/ForgotPassword"
// import History from "./pages/user/History";
// import Password from "./pages/user/Password";
// import Wishlist from "./pages/user/Wishlist";
// import Product from "./pages/Product";
// import Shop from "./pages/Shop";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import Payment from "./pages/Payment";
// import SideDrawer from "./components/drawer/SideDrawer";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import CategoryCreate from "./pages/admin/category/CategoryCreate";
// import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
// import SubCreate from "./pages/admin/sub/SubCreate";
// import SubUpdate from "./pages/admin/sub/SubUpdate";
// import CreateCouponPage from "./pages/admin/coupon/CreateCouponPage";
// import SubHome from "./pages/sub/SubHome";
// import ProductCreate from "./pages/admin/product/ProductCreate";
// import AllProducts from "./pages/admin/product/AllProducts";
// import ProductUpdate from "./pages/admin/product/ProductUpdate";
// import CategoryHome from "./pages/category/CategoryHome";

// import {ToastContainer} from "react-toastify";
// import {auth} from "./firebase";
// import {useDispatch} from "react-redux";
// import {currentUser} from "./functions/auth";

// import "react-toastify/dist/ReactToastify.css";

const UserRoute = lazy(()=>import("./components/routes/UserRoute"));
const AdminRoute = lazy(()=>import("./components/routes/AdminRoute"));
const Home  = lazy(()=>import("./pages/Home"));
const Login = lazy(()=>import("./pages/auth/Login"));
const Register  = lazy(()=>import("./pages/auth/Register"));
const Header  = lazy(()=>import("./components/nav/Header"));
const RegisterComplete  = lazy(()=>import("./pages/auth/RegisterComplete"));
const ForgotPassword  = lazy(()=>import("./pages/auth/ForgotPassword"));
const History  = lazy(()=>import("./pages/user/History"));
const Password  = lazy(()=>import("./pages/user/Password"));
const Wishlist  = lazy(()=>import("./pages/user/Wishlist"));
const Product  = lazy(()=>import("./pages/Product"));
const Shop  = lazy(()=>import("./pages/Shop"));
const Cart  = lazy(()=>import("./pages/Cart"));
const Checkout  = lazy(()=>import("./pages/Checkout"));
const Payment  = lazy(()=>import("./pages/Payment"));
const SideDrawer  = lazy(()=>import("./components/drawer/SideDrawer"));
const AdminDashboard  = lazy(()=>import("./pages/admin/AdminDashboard"));
const CategoryCreate  = lazy(()=>import("./pages/admin/category/CategoryCreate"));
const CategoryUpdate  = lazy(()=>import("./pages/admin/category/CategoryUpdate"));
const SubCreate  = lazy(()=>import("./pages/admin/sub/SubCreate"));
const SubUpdate  = lazy(()=>import("./pages/admin/sub/SubUpdate"));
const CreateCouponPage  = lazy(()=>import("./pages/admin/coupon/CreateCouponPage"));
const SubHome  = lazy(()=>import("./pages/sub/SubHome"));
const ProductCreate  = lazy(()=>import("./pages/admin/product/ProductCreate"));
const AllProducts  = lazy(()=>import("./pages/admin/product/AllProducts"));
const ProductUpdate  = lazy(()=>import("./pages/admin/product/ProductUpdate"));
const CategoryHome  = lazy(()=>import("./pages/category/CategoryHome"));

const App = () => {
  const dispatch = useDispatch();

  //to check firebase auth state once initialize using useEffect hook
  useEffect(()=> {
    console.log("IN APP.JS USEEFFECT");
    //check if user is signed in using onAuthStateChagned.
    //onAuthStateChanged listen to the user state change and return user or null.
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if(user) {
        const idTokenResult = await user.getIdTokenResult();
        console.log("IN APP.JS USER IS ",user);
        currentUser(idTokenResult.token)
        .then((res)=>{
          dispatch({
            type:"LOGGED_IN_USER",
            payload: {
              name:res.data.name,
              email:res.data.email,
              token:idTokenResult.token,
              role:res.data.role,
              _id: res.data._id
            }
          })
        })
        .catch(err=>console.log(err));
      }//end user check
    });//end unsubscribe
    //clean up, stop listening to onAuthStateChanged as user already sign in
    return () => unsubscribe();
  },[dispatch]);//end useEffect

  return (
    <Suspense fallback={<div className="col text-center p-5">_React Redux EC<LoadingOutlined/>MMERC___</div>}>
      <Header />
      <SideDrawer/>
      <ToastContainer/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/register/complete" component={RegisterComplete}/>
          <Route exact path="/forgot/password" component={ForgotPassword}/>
          <Route exact path="/product/:slug" component={Product}/>
          <Route exact path="/shop" component={Shop}/>
          <Route exact path="/cart" component={Cart}/>
          <Route exact path="/category/:slug" component={CategoryHome}/>
          <Route exact path="/sub/:slug" component={SubHome}/>
          <UserRoute exact path="/user/history" component={History} />
          <UserRoute exact path="/user/Password" component={Password} />
          <UserRoute exact path="/user/Wishlist" component={Wishlist} />
          <UserRoute exact path="/checkout" component={Checkout}/>
          <UserRoute exact path="/payment" component={Payment} />
          <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
          <AdminRoute exact path="/admin/category" component={CategoryCreate} />
          <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate} />
          <AdminRoute exact path="/admin/sub" component={SubCreate} />
          <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate} />
          <AdminRoute exact path="/admin/product" component={ProductCreate} />
          <AdminRoute exact path="/admin/products" component={AllProducts} />
          <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate} />
          <AdminRoute exact path="/admin/coupon" component={CreateCouponPage} />
      </Switch>
    </Suspense>
  );
}

export default App;
