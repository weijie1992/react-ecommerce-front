import React, {useState} from "react";
import {Card, Tooltip} from "antd";
import {EyeOutlined, ShoppingCartOutlined} from "@ant-design/icons"
import laptop from "../../Images/computer/laptop.png";
import {Link} from "react-router-dom";
import {showAverage} from "../../functions/rating";
import _ from "lodash";
import {useSelector,useDispatch} from "react-redux";

const Meta = Card.Meta;

const ProductCard = ({product}) => {
    const {brand,category,color,description,images,price,quantity,shipping,slug,subs,title} = product;
    const [tooltip, setTooltip] = useState("Click to add");
    const {user,cart,drawer} = useSelector((state) => {
        return ({...state});
    });
    const dispatch = useDispatch();
    const handleAddToCart = () =>{
        
        //create cart array
        let cart = [];
        //check if user is window as local storage is part on window object
        if(typeof window!=="undefined") {
            //If cart object is already in local storage retrieved it. else create the cart object
            if(localStorage.getItem("cart")) {
                cart = JSON.parse(localStorage.getItem("cart"));//convert JSON string to JSON object
            } 
            //save the product to local storage using spread operator, this will spread the product to individual object
            //console.log("SPREAD!!!!!!",...product);
            cart.push({
                ...product,
                count:1,
            });
            //remove duplicate() using lodash, this will return unique array
            let unique = _.uniqWith(cart,_.isEqual);
            localStorage.setItem("cart",JSON.stringify(unique)); //convert JSON object to JSON String
            dispatch({
                type:"ADD_TO_CART",
                payload:unique
            });
            dispatch({
                type:"SET_VISIBLE",
                payload:true
            })
            setTooltip("Added");
        }
    }
    return (
        <>
        {product&&product.ratings&&product.ratings.length>0?showAverage(product):(<div className="text-center pt-1 pb-3">No Rating Yet</div>)}
            <Card
                cover={
                    <img
                        src={images && images.length?images[0].url:laptop}
                        style={{height:"150px",objectFit:"cover"}}
                        className="p-1"
                    />
                }
                actions ={[
                    <Link to={`/product/${slug}`}>
                        <EyeOutlined className="text-warning" /><br/>View Product
                    </Link>,
                    <Tooltip title={tooltip}>
                        <a disabled={product.quantity<1} onClick={handleAddToCart}>
                        <ShoppingCartOutlined  className="text-danger" /><br/>{product.quantity<1?"Out Of Stock":"Add to Cart"}
                        </a>
                        
                    </Tooltip>
                ]}
            >
                <Meta title={`${title}-$${price}`} description={`${description && description.substring(0,15)}...`}></Meta>
            </Card>
        </>
    );
}
    
export default ProductCard;