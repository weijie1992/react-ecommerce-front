import React from "react";
import ModalImage from "react-modal-image";
import laptop from "../../Images/computer/laptop.png";
import {createSelectorHook, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {CheckCircleOutlined,CloseCircleOutlined,CloseOutlined} from "@ant-design/icons";


const ProductCartInCheckOut = ({p}) => {
    const dispatch = useDispatch();
    const colors = ["Black", "Brown", "Silver", "White", "Blue"];
    const handleColorChange = (event) => {
        console.log("color chnaged", event.target.value);
        let cart = [];
        if(typeof window !== "undefined") {
            if(localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            //Cart have entire product array, thus we find the exact product._id that matcht he current product._id which is p
            cart.map((product,i)=> { 
                if(product._id === p._id) {
                   cart[i].color = event.target.value;
                }
            });
            localStorage.setItem("cart",JSON.stringify(cart));
            
            dispatch({
                type:"ADD_TO_CART",
                payload:cart
            });
    
        }
    }
    const handleQuantityChange =(event) => {
        let count = event.target.value < 1 ? 1 : event.target.value;
        if(count > p.quantity) {
            toast.error("Max available quantity", p.quantity);
            return;
        }
        if(typeof window !== "undefined") {
            let cart = [];
            if(localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            cart.map((product,i)=> {
                if(product._id === p._id) {
                    
                    cart[i].count = count;
                }
            });
            localStorage.setItem("cart",JSON.stringify(cart));

            dispatch({
                type:"ADD_TO_CART",
                payload:cart
            });
        }
    }

    const handleRemove = (event) => {
        if(typeof window !== "undefined") {
            let cart = [];
            if(localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));
            }
            let updatedCard = cart.filter((product) => {
                return product._id !== p._id;
            });
            localStorage.setItem("cart", JSON.stringify(updatedCard));
            dispatch({
                type: "ADD_TO_CART",
                payload: updatedCard
            });
        }
    }
    return (
        <tbody>
            <tr>
                <td style={{width:"100px", height:'auto'}}>
                    {p.images.length?(<ModalImage small={p.images[0].url} large={p.images[0].url}></ModalImage>)
                    :(<ModalImage small={laptop} large={laptop}></ModalImage>)}
                </td>
                <td>
                    {p.title}
                </td>
                <td>
                    {p.price}
                </td>
                <td>
                    {p.brand}
                </td>
                <td>
                    <select className="form-control" onChange={handleColorChange}>{p.color?<option>{p.color}</option>:<option>Please Select</option>}
                    {colors.filter((c)=> {
                        return c!==p.color;
                    }).map((c)=>{
                        return <option value={c} key={c}>{c}</option>
                    })}
                    </select>
                </td>
                <td className="text-center">
                    <input
                    type="number"
                    className="form-control"
                    value={p.count}
                    onChange={handleQuantityChange}
                    ></input>
                </td>
                <td className="text-center">
                    {p.shipping==="Yes"?<CheckCircleOutlined className="text-success"/>:<CloseCircleOutlined className="text-danger"/>}
                </td>
                <td className="text-center">
                    <CloseOutlined onClick={handleRemove} className="text-danger pointer"/>
                </td>
            </tr>
        </tbody>
    )
};

export default ProductCartInCheckOut;