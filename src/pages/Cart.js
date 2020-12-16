import React from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import ProductCartInCheckOut from "../components/cards/ProductCartInCheckOut";
import {userCart} from "../functions/user";

const Cart = (props) => {
    const {user, cart} = useSelector((state) => {
        return ({...state});
    });
    const dispatch = useDispatch();

    const getTotal = () => {
        return cart.reduce((currentValue,nextValue) => {
            console.log("currentValue:", currentValue,"nextValue", nextValue);
            return currentValue+nextValue.count * nextValue.price
        },0)
    };

    const saveOrderToDB = async() => {
        console.log("cart",JSON.stringify(cart));
        try {
            const res = await userCart(cart, user.token);
            console.log("Cart Post Res ", res);
            if (res.data.ok) {
                dispatch({
                    type: "COD",
                    payload: false
                });
                props.history.push("/checkout");
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    const saveCashOrderToDB = async () => {
        console.log("cart",JSON.stringify(cart));
        try {
            const res = await userCart(cart, user.token);
            console.log("Cart Post Res ", res);
            if (res.data.ok) {
                dispatch({
                    type: "COD",
                    payload: true
                });
                props.history.push("/checkout");
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    const showCartItem = () => {
        return(
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Count</th>
                    <th scope="col">Shipping Icon</th>
                    <th scope="col">Remove Icon </th>
                </tr>
            </thead>
            {cart.map((p)=>{
                return (<ProductCartInCheckOut key={p._id} p={p} />)
            })}
        </table>
        );
    }
    

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-8">
                <h4>Cart/ {cart.length} Product</h4>
                    {!cart.length
                    ?(<p>No Products in cart.<Link to="/shop">Continue Shopping</Link></p>)
                    :showCartItem()
                    }
                </div>
                <div className="col-md-4">
                    <h4>Order Sumary</h4>
                    <hr/>
                    <p>Products</p>
                    {cart.map((cart,index)=>{
                        return(<div key={index}>
                            <p>{cart.title} x {cart.count} = ${cart.price * cart.count}</p>
                        </div>)
                    })}
                    <hr/>
                    Total : <b>${getTotal()}</b> 
                    <hr/>
                    {
                        user&&user.token?(
                            <>
                                <button 
                                    onClick={saveOrderToDB} 
                                    disabled={!cart.length}
                                    className="btn btn-sm btn-primary mt-2">Proceed to Checkout
                                </button>
                                <br/>
                                <button 
                                    onClick={saveCashOrderToDB} 
                                    disabled={!cart.length}
                                    className="btn btn-sm btn-warning mt-2">Pay Cash on Delivery
                                </button>
                            </>
                            
                        ):(
                            <button 
                                className="btn btn-sm btn-primary mt-2">
                                <Link 
                                to={
                                    {pathname:"/login", state:{from:"cart"}
                                    }}
                                >Login to Checkout
                                </Link>
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
export default Cart;