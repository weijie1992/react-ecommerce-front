import React,{useState} from "react";
import {Card,Tabs,Tooltip} from "antd";
import {Link} from "react-router-dom";
import {HeartOutlined,ShoppingCartOutlined} from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Laptop from "../../Images/computer/laptop.png";
import ProductListItems from "../../components/cards/ProductListItems";
import StarRating from "react-star-ratings";
import RatingModal from  "../modal/RatingModal";
import {showAverage} from "../../functions/rating";
import _ from "lodash";
import {useSelector,useDispatch} from "react-redux";
import {addToWishlist} from "../../functions/user";
import { toast } from "react-toastify";
import {useHistory} from "react-router-dom";

const Meta = Card.Meta;
const TabPane = Tabs.TabPane;

const SingleProduct = ({product,onStarClick,star}) => {
    const [tooltip, setTooltip] = useState("Click to add");

    const {user,cart} = useSelector((state) => {
        return ({...state});
    });

    const dispatch = useDispatch();

    const {title, images,description,_id} = product;

    let history = useHistory();

    const handleAddToCart = () => {
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
    };
    const handleAddToWishlist = async (event) => {
        event.preventDefault();
        const res = await addToWishlist(user.token, product._id);
        //check success
        if(res.data.ok) {
            toast.success("Added to wishlist");
        }
        else {
            toast.success("Fail to add to wishlist");
        }
    }
    return (
        <>
            <div className="col-md-7">
                {
                    images&&images.length>0
                    ?
                    (<Carousel showArrows={true} autoPlay infiniteLoop>
                    {
                    (images.map((image)=>{
                            return (<img src={image.url} key={image.public_id}/>)
                        }))
                    }
                    </Carousel>)
                    :
                    (
                        <Card cover={<img src={Laptop} className="mb-3 card-image"/>} />
                    )
                
                }
                <Tabs type="card">
                    <TabPane tab="Description" key="1"><span className="pl-3" >{description && description}</span></TabPane>
                    <TabPane tab="More" key="2"><span className="pl-3" >More info please contact wj @ +65-XXXX-XXXX</span></TabPane>
                </Tabs>
            </div>
            <div className="col-md-5">
            <h1 className="bg-info p-3">{title}</h1>
            {product&&product.ratings&&product.ratings.length>0?showAverage(product):(<div className="text-center pt-1 pb-3">No Rating Yet</div>)}
                <Card 
                actions = {[
                    <Tooltip title={tooltip}>
                        <a onClick={handleAddToCart}>
                            <ShoppingCartOutlined className="text-success"/><br/>Add to Cart
                        </a>
                    </Tooltip>,
                    <>
                        <a onClick={handleAddToWishlist}><HeartOutlined className="text-info"/><br/>Add to wishlist</a>
                    </>,
                    <RatingModal>
                        <StarRating
                            name={_id}
                            numberOfStars={5}
                            rating={star}
                            changeRating={onStarClick}
                            isSelectable={true}
                            starRatedColor="red"
                        />
                    </RatingModal>
                ]}>
                    <ProductListItems
                    product={product}/>
                </Card>
            </div>
        </>
    )
};

export default SingleProduct;