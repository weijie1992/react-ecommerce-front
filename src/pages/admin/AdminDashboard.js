import React, { Fragment,useEffect, useState } from "react";
import {useSelector} from "react-redux";
import AdminNav from "../../components/nav/AdminNav";
import {getOrders,changeStatus} from "../../functions/admin";
import {toast} from "react-toastify";
import Orders from "../../components/order/Orders";

const AdminDashboard = () => {
    const {user} = useSelector((state) => 
    {
        return ({...state});
    });
    const [orders, setOrders] = useState([]);

    const loadAllOrder = async () => {
        try{
            const res = await getOrders(user.token);
            setOrders(res.data);
        }
        catch(err) {

        }
    }

    useEffect(()=> {
        loadAllOrder();
    },[]);

    const handleStatusChange = async (orderId, orderStatus) => {
        try {
            const res = await changeStatus(orderId,orderStatus,user.token);
            toast.success("Status updated");
            loadAllOrder();
        }
        catch(err) {

        }
        
    }


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col-md-10">
                    <h4>Admin Dashboard</h4>
                    <Orders orders={orders} handleStatusChange={handleStatusChange}/>
                    
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;