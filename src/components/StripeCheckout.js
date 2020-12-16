import React, { useState,useEffect} from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {useSelector,useDispatch} from "react-redux";
import {createPaymentIntent} from "../functions/stripe";
import {Link} from "react-router-dom";
import {Card} from "antd";
import {DollarOutlined,CheckOutlined} from "@ant-design/icons";
import Laptop from "../Images/computer/laptop.png"
import {createOrder,emptyUserCart} from "../functions/user";

const StripeCheckout = (props) => {
    const dispatch = useDispatch();
    const {user,coupon} = useSelector((state)=> {
        console.log("hehehe");
        return ({...state});
    });
    
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState("");

    const [cartTotal, setCartTotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscountt] = useState(0);
    const [payable, setPayable] = useState(0);

    const stripe = useStripe();
    const Elements = useElements();

    useEffect(()=> {
      console.log("HAHAUSER",user);
      console.log("hahaha");
      //Call to server for client secret
      createPaymentIntent(user.token,coupon)
      .then(async (res)=> {
        setClientSecret(res.data.clientSecret);
        setCartTotal(res.data.cartTotal);
        setTotalAfterDiscountt(res.data.totalAfterDiscount);
        setPayable(res.data.payable);
      })
    },[]);

    const handleSubmit = async (event) =>{
        event.preventDefault();
        setProcessing(true);
        //get Secret from server and call stripe API
        const res = await stripe.confirmCardPayment(clientSecret, {
          payment_method : {
            card: Elements.getElement(CardElement),
            billing_details: {
              name : event.target.name.value
            }
          }
        });
        console.log("***RES1",res);
        if(res.error) {
          setError(`Payment Failed ${res.error.message}`)
          setProcessing(false);
        } else { //if successful payment
          //create order, save in DB for admin to process
          const res2 = await createOrder({paymentIntent:res.paymentIntent}, user.token);
          console.log("***RES2",res2);
          if(res2.data.ok) {
            //empty cart from local storage
          if(typeof window!=="undefined") {
            localStorage.removeItem("cart");
          }
          //empty cart from redux
          dispatch({
            type:"ADD_TO_CART",
            payload:[]
          });
          //reset Coupon to false
          dispatch({
            type:"COUPON_APPLIED",
            payload:false
          });
          //empty cart from database
          const res3 = await emptyUserCart(user.token)    
          console.log("***RES3",res3);    
          setError(null);
          setProcessing(false);
          setSucceeded(true);
          }
          
          
          
        }
      }

    const handleChange = async (event) =>{
        //listen for changes in the card element
        setDisabled(event.empty); //disabled pay button if errors
        setError(event.error?event.error.message:"");
    }

    //CSS for CardElement
    const cartStyle = {
        style: {
          base: {
            color: "#32325d",
            fontFamily: "Arial, sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
      };

    return (
    
        <>
        {
          !succeeded && <div>
            {coupon&&totalAfterDiscount>0
            ?(<p className="alert alert-success">{`Total after discount : ${totalAfterDiscount}`}</p>)
            :(<p className="alert alert-danger">No Coupon Apply</p>)}            
          </div>
        }
        <p className={succeeded?"result-message":"result-message hidden"}>Payment Successful
        <Link to="/user/history">View in purchase history</Link></p>
        <div className="text-center pb-5">
          <Card 
            cover={<img src={Laptop} style={{height:'200px', objectFit:"cover",marginBottom:"-50px"}}/>}
            actions={[
              <>
                <DollarOutlined className="text-info" /><br/>Total: ${cartTotal}
              </>,
              <>
              <CheckOutlined className="text-info" /><br/>Total payable: ${(payable/100).toFixed(2)}
            </>,
            ]}
          />
        </div>
            <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
                <CardElement id="card-element" options={cartStyle} onChange={handleChange} />
                
                <button className="stripe-button" disabled={processing||disabled||succeeded}>
                    <span id="button-text">
                        {processing ? (<div className="spinner" id= "spinner"></div>):("Pay")}
                    </span>
                </button>
                <br/>
                {error&&<div className="card-error" role="alert">{error}</div>}
            </form>

            
        </>
    )
}
export default StripeCheckout;