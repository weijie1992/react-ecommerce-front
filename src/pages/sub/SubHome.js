import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import {getSub} from "../../functions/sub";
import ProductCard from "../../components/cards/ProductCard";

const SubHome = (props) => {
    const [sub,setSub] = useState("");
    const [loading,setLoadting] = useState(false);
    const [products, setProducts] = useState([]);
    const slug = props.match.params.slug;

    const loadSubProduct = async () => {
        try {
            setLoadting(true);
            let res = await getSub(slug);
            setSub(res.data.sub);
            setProducts(res.data.products);
            setLoadting(false);
        }
        catch(err) {
            setLoadting(false);
            console.log(err);
            toast.error("Error retrieving products base on sub categories",err.message);
        }
    }
    useEffect(()=> {
        loadSubProduct();
    },[]);
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {
                        loading 
                        ? (<h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">Loading</h4>) 
                        : (<h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">{products.length} Products in "{sub.name}" category</h4>) 
                    }
                </div>
            </div>
            <div className="row">
                {products.map((product)=> {
                    return (
                        <div key={product._id} className="col-md-4">
                            <ProductCard product={product}/>
                        </div>
                    )
                })} 
            </div>
            
        </div>
    )
}

export default SubHome;