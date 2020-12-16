import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {getProductsByCount,removeProduct} from "../../../functions/product";
import {toast} from "react-toastify";
import {LoadingOutlined} from "@ant-design/icons";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import {useSelector} from "react-redux";


const AllProducts = () => {

    const user = useSelector((state) => {
        return state.user;
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    

    const loadAllProducts = () => {
        setLoading(true);
        getProductsByCount(100)
        .then((res)=>{
            console.log(res.data);
            setLoading(false);
            setProducts(res.data);
        })
        .catch((err)=> {
            console.log(err);
            setLoading(false);
            toast.error("Error Fetching Products : ", err.message);
        })
    }

    const handleRemove = (slug) => {
        if(window.confirm("Delete")) {
            setLoading(true);
            removeProduct(slug,user.token)
            .then((res) => {
                setLoading(false);
                loadAllProducts();
                toast.success(`${res.data.product} has been deleted`);
            })
            .catch((err)=> {
                console.log(err);
                setLoading(false);
                toast.error("Error Deleting Products : ", err.message);
            })
        }
    }

    useEffect(()=> {
        loadAllProducts();
    },[]);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col-md-10">
                    <div className="row">
                        {
                            loading?<LoadingOutlined />
                            :products.map((product)=>{
                                return(
                                    <div className="col-md-4 pb-3" key={product._id}>
                                        <AdminProductCard
                                        product={product} 
                                        handleRemove={handleRemove} />
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllProducts;