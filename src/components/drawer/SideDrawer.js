import React, { Fragment } from "react";
import {Drawer,Button} from "antd";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import laptop from "../../Images/computer/laptop.png";

const SideDrawer = () => {
    const dispatch = useDispatch();
    const {drawer, cart} = useSelector((state)=>{return {...state}});
    const imageStyle = {
        width:"100%",
        height:"50px",
        objectFit:"cover"
    }
    return (
        <Drawer 
        className="text-center"
        title={`Cart/${cart.length} Product`}
        visible={drawer}
        onClose={()=>dispatch({
            type:"SET_VISIBLE",
            payload:false
        })}>
            {cart.map((product)=> {
                return (
                <Fragment key={product._id}>
                    <div className="row">
                        {product.images[0]?(<img src={product.images[0].url} style={imageStyle} />):<img src={laptop} style={imageStyle} />}
                    </div>
                    <p className="text-center bg-secondary text-light">{product.title} x {product.count}</p>
                    
                </Fragment>
               )
            })}
            <Link to ="/cart">
                <button 
                    className="text-center btn btn-primary btn-raised btn-block" 
                    onClick={()=>{
                        return dispatch({
                        type:"SET_VISIBLE",
                        payload:false
                    })}}>
                    Go To Cart
                </button>
            </Link>
        </Drawer>
    )
}

export default SideDrawer;