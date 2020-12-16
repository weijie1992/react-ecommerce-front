import useSelection from "antd/lib/table/hooks/useSelection";
import React, { useEffect,useState } from "react";
import { toast } from "react-toastify";
import {getProduct,productStars,getRelated} from "../functions/product";
import SingleProduct from "../components/cards/SingleProduct";
import {useSelector} from "react-redux";
import ProductCard from "../components/cards/ProductCard";

const Product = (props) => {
    const user = useSelector((state)=>
    {
        return state.user;
    })
    const [product, SetProduct] = useState("");
    const [star, setStar] = useState(0);
    const [related, setRelated] = useState([]);

    const onStarClick = (newRating,name) => { //newRating and name is the callback when user clicked on the star
        console.table(newRating,name);
        productStars(name,newRating,user.token)
        .then((res)=>{
            console.log(res.data);
            setStar(newRating);
            loadSingleProduct();
        })
        .catch((err) => {
            console.log(err);
            toast.error("Error sending rating");
        })
    }

    const loadSingleProduct = () => {
        getProduct(props.match.params.slug)
        .then((res)=> {
            SetProduct(res.data);
            getRelated(res.data._id)
            .then((res)=>{
                setRelated(res.data);
            })
            .catch(err=>{
                console.log(err);
                toast.error("Error retrieving product", err);
            })
        })
        .catch(err=>{
            console.log(err);
            toast.error("Error retrieving product", err);
        });
    };

    useEffect(()=>{
        loadSingleProduct();
    },[props.match.params.slug]);

    //retrive user star state
    useEffect(() => {
        if(product.ratings && user) {
            let checkExistingRatedUser = product.ratings.find((existingRatedUser)=>{
                return existingRatedUser.postedBy==user._id;
            });
            if(checkExistingRatedUser) {
                setStar(checkExistingRatedUser.star)
            }
        }
    })

    return (
        <div className="container-fluid">
            <div className="row pt-4">
                <SingleProduct
                product={product}
                onStarClick={onStarClick}
                star={star}
                />
            </div>
            <div className="row">
                <div className="col text-center pt-5 pb-5">
                    <hr/>
                        <h4>Related Products</h4>
                    <hr/>
                </div>
            </div>
            <div className="row">
                {
                    related&&related.length>0
                    ? related.map((r)=>{
                        return (
                            <div className="col-md-4" key={r._id}>
                                <ProductCard product={r}/>
                            </div>
                        )
                    })
                    :(<div className="text-center col">No related products found</div>)
                }
            </div>
        </div>
    )
}
export default Product;