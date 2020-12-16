import React, {useState,useEffect} from "react";
import {getCategories, getCategory} from "../../functions/category";
import {Link} from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard"

const CategoryHome = (props) => {

    const [category, setCategory] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const slug = props.match.params.slug;

    useEffect(()=> {
        setLoading(true);
        getCategory(slug)
        .then((res)=>{
            console.log(JSON.stringify(res.data,null,4));
            setLoading(false);
            setCategory(res.data.category);
            setProducts(res.data.products);
        })
        .catch((err)=>{
            setLoading(false);
            console.log(err);
        })
    },[]);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {
                        loading 
                        ? (<h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">Loading</h4>) 
                        : (<h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">{products.length} Products in "{category.name}" category</h4>) 
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
    );
}
export default CategoryHome;