import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getUserCart, emptyUserCart,saveUserAddress,applyCoupon,createCashOrderForUser } from "../functions/user";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = (props) => {

  const dispatch = useDispatch();
  const {user,COD} = useSelector((state)=> {
    return ({...state});
  });
  const couponTrueOrFalse = useSelector((state)=> {
    return state.coupon;
  });
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved,setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [totalAfterDiscount,setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    console.log("HAHAUSER",user);
    console.log("hahaha");
    getUserCart(user.token).then((res) => {
      console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const emptyCart = () => {
    // remove from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    // remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setDiscountError("");
      toast.success("Cart is emapty. Contniue shopping.");
    });
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, {address:address})
    .then(res => {
        if(res.data.ok) {
            setAddressSaved(true);
            toast.success("Address Saved");
        }
    })
  };

  const showAddress = () => {
    return (<>
    <ReactQuill theme="snow" value={address} onChange={setAddress}/>
        <button className="btn btn-primary mt-2" disabled={!address} onClick={saveAddressToDb}>
          Save
        </button>
    </>)
  }

  const showProductSummary = () => {
    return products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          {p.product.price * p.count}
        </p>
      </div>
    ))};
    
    const applyDiscountCoupon = async () =>{
      console.log("send coupon to backend", coupon);
      try {
        //set state to initial
        setDiscountError("");
        setTotalAfterDiscount(0);

        const res = await applyCoupon(user.token, {coupon:coupon});
        if(res.data.err) {
          setDiscountError(res.data.err);
          //update redux coupon applied to true/false
          dispatch({
            type: "COUPON_APPLIED",
            payload: false
          });
        }
        else if(res.data) {
          setTotalAfterDiscount(res.data);
          //update redux coupon applied to true/false
          dispatch({
            type: "COUPON_APPLIED",
            payload: true
          });
        }
        
      }
      catch(err) {
        console.log(err);
        toast.error("Discount error");
      }
    }

    const showApplyCoupon = () => {
      return (
        <>
          <input 
            type="text"
            onChange={(event)=> {
              return setCoupon(event.target.value);
            }}
            value={coupon}
            className="form-control"
          />
          <button className="btn btn-primary mt-2" onClick={applyDiscountCoupon}>
            Apply
          </button>
        </>
      )
    }

    const createCashOrder = async () => {
      try{
        const res = await createCashOrderForUser(user.token,COD,couponTrueOrFalse);
        if(res.data.ok) {
          //empty local storage
          if(typeof window!=="undefined") {
            localStorage.removeItem("cart");
          }
          //empty redux cart
          dispatch({
            type:"ADD_TO_CART",
            payload:[]
          });
          //empty redux coupon
          dispatch({
            type:"COUPON_APPLIED",
            payload:false
          });
          //empty redux COD
          dispatch({
            type:"COD",
            payload:false
          });
          //empty DB cart
          const res2 = await emptyUserCart(user.token);
          setTimeout(()=> {
            props.history.push("/user/history")
          },1000)
        }
      }
      catch(err)
      {
        
      }
    }

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br/>
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
       {showProductSummary()}
        <hr />
        <p>Cart Total: {total}</p>
        {totalAfterDiscount>0 && (
          <p className="bg-success p-2">Discount Applied : Total Payable ${totalAfterDiscount}</p>
        ) }

        <div className="row">
          <div className="col-md-6">
            {/* {COD?<h1>True</h1>:<h1>false</h1>} */}
            {COD?(
              <button 
              disabled={!addressSaved || !products.length} 
              className="btn btn-primary" 
              onClick={createCashOrder}
            >
          Place Order</button>
            ):(
              <button 
                disabled={!addressSaved || !products.length} 
                className="btn btn-primary" 
                onClick={()=> {
                  return props.history.push("/payment");
                }}
              >
            Place Order</button>)}
            
          </div>

          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
