import React, {useState,useEffect} from "react";
import {getProducts,getProductsCount} from "../../functions/product";
import LoadingCard from "../cards/LoadingCard";
import { toast } from "react-toastify";
import ProductCard from "../cards/ProductCard";
import {Pagination} from "antd";

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productCount, setProductCount] = useState(0);
    const [page,setPage] = useState(1);

    const loadAllProducts = () => {
        setLoading(true);
        console.log(page);
        //sort, order, page
        getProducts('createdAt','desc',page)
        .then((res) => {
        setLoading(false);
        console.log(res.data);
        setProducts(res.data);
        })
        .catch((err)=>{
        console.log(err);
        toast.error("Error Loading All Product");
        })
    };

    useEffect(()=> {
        loadAllProducts();
    },[page]);

    useEffect(() => {
        getProductsCount()
        .then((res) => {
            return setProductCount(res.data);
        })
        .catch((err)=>{
            console.log(err);
            toast.error("Fail to get product count");
        })
    }, []);

    return(
        <> 
            <div className="container">
                {loading?(<LoadingCard count={3}/>)
                :(<div className="row">
                {products.map((product)=>{
                    return (<div key={product._id} className="col-md-4">
                    <ProductCard product={product} />
                    </div>);
                })}
                </div>)}
            </div>
            <div className="row">
                <nav className="col-md-4 offset-md-4 text-center">
                    <Pagination
                        defaultCurrent={page} 
                        total={(productCount/3) * 10} 
                        onChange={(value) => setPage(value)}
                    />
                </nav>
            </div>
            
      </>
    );
}
export default NewArrivals;