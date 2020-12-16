import React, { useEffect,useState } from "react";
import UserNav from "../../components/nav/UserNav";
import {getWishlist,removeWishlist} from "../../functions/user";
import {useSelector,useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {DeleteOutlined} from "@ant-design/icons";

const WishList = () => {
    const [wishlist, setWishlist] = useState([]);
    const {user} = useSelector((state) => { return ({...state})});

    useEffect(() => {
        loadWishlist();
    },[]);

    const loadWishlist = async() => {
        const res = await getWishlist(user.token);
        setWishlist(res.data.wishlist);
    };

    const handleRemove = async (productId) => {
        const res = await removeWishlist(user.token,productId);
        if(res.data.ok) {
            loadWishlist();
        }
    };

    return (
    <div className="container-fluid">
        <div className="row">
            <div className="col-md-2">
                <UserNav/>
            </div>
            <div className="col-md-10">
                <h4>Wishlist</h4>
                {wishlist && wishlist.map((p)=>{
                    return (
                        <div key={p._id} className="alert alert-secondary">
                            <Link to={`/product/${p.slug}`}>{p.title}</Link>
                            <span onClick={()=>handleRemove(p._id)} className="btn btn-sm float-right">
                                <DeleteOutlined className="text-danger"/>
                            </span>
                        </div>
                    )
                })}
            
            </div>
        </div>
    </div>
    )
}
export default WishList;