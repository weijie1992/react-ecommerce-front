import React,{useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-toastify";
import DatePicker from "react-datepicker";
import {getCoupons,removeCoupon,createCoupon} from "../../../functions/coupon";
import {DeleteOutlined} from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";
import Product from "../../Product";
import "react-datepicker/dist/react-datepicker.css";

const CreateCouponPage = () => {
    const {user} = useSelector((state) => {
        return ({...state});
    });
    const [name, setName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [discount, setDiscount] = useState("");
    const [loading, setLoading] = useState("");
    const [coupons, setCoupons] = useState([]);

    useEffect(()=> {
        setLoading(true);
        loadCoupons();
    },[]);

    const loadCoupons = () => {
        getCoupons()
        .then((res)=> {
            setLoading(false);
            setCoupons(res.data);
        })
        .catch(err=>console.log(err));
    }

    const handleSubmit =(event) => {
        event.preventDefault();
        setLoading(true);
        console.log(expiry);
        createCoupon(
            {
                name:name,
                expiry:expiry,
                discount:discount
            }
            ,user.token
        )
        .then((res)=>{
            setLoading(false);
            setName("");
            setDiscount("");
            setExpiry("");
            loadCoupons()
            toast.success("Successfully created");
        })
        .catch((err) => {
            toast.error("Error Creating Coupon");
            console.log(err);
        });
    };

    const handleRemove = (couponID) => {
        if(window.confirm("Delete?")){
            removeCoupon(couponID,user.token)
            .then((res)=>{
                setLoading(true);
                loadCoupons();
                toast.success(`${res.data.name} Succesfully deleted`);
            })
            .catch((err)=>
            {
                console.log(err);
            })
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col-md-10">
                    <h4>Coupon</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="text-muted">Name</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            onChange={(e)=>{return setName(e.target.value)}}
                            value={name}
                            autoFocus
                            required
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Discount %</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            onChange={(e)=>{return setDiscount(e.target.value)}}
                            value={discount}
                            required
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Expiry</label>
                            <DatePicker 
                                className="form-control" 
                                selected={expiry}
                                value={expiry}
                                required
                                onChange={(date)=>setExpiry(date)}
                            />
                        </div>
                        <button className="btn btn-outline-primary">Save</button>
                    </form>
                    <br/>
                    <h4>{coupons.length} Coupons</h4>
                    <table className="table table-bordered">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Expiry</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon)=>{
                                return (<tr key={coupon._id}>
                                    <td>{coupon.name}</td>
                                    <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                                    <td>{coupon.discount}%</td>
                                    <td><DeleteOutlined className="text-danger pointer" onClick={()=>handleRemove(coupon._id)}/></td>
                                </tr>);
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CreateCouponPage;