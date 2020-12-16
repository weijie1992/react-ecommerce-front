import React from "react";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import ShowPaymentInfo from "../cards/ShowPaymentInfo";

const Orders = ({orders,handleStatusChange}) => {
    const showOrderInTable = (order) => {
        return (
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Price</th>
                        <th scope="col">Brand</th>
                        <th scope="col">Color</th>
                        <th scope="col">Count</th>
                        <th scope="col">Shipping</th>
                    </tr>
                </thead>
                <tbody>
                    {order.products.map((product)=> {
                        return (
                            <tr key={product._id}>
                                <td><b>{product.product.title}</b></td>
                                <td><b>{product.product.price}</b></td>
                                <td><b>{product.product.brand}</b></td>
                                <td><b>{product.color}</b></td>
                                <td><b>{product.count}</b></td>
                                <td>
                                    <b>{product.product.shipping=="Yes"?(<CheckCircleOutlined style={{color:"green"}}/>)
                                    :(<CloseCircleOutlined style={{color:"red"}}/>)}</b>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    };
    return (
        <>
            {orders.map((order) => {
                return (
                <div key={order._id} className="row pb-5">
                    <div className="btn btn-block bg-light">
                        <ShowPaymentInfo order={order} showStatus={false}/>
                        
                        <div className="row">
                            <div className="col-md-4">Delivery Status</div>
                            <div className="col-md-8">
                                <select 
                                    onChange={(event)=>{return handleStatusChange(order._id,event.target.value)}}
                                    className="form-control"
                                    defaultValue={order.orderStatus}
                                    name="status"
                                >
                                        <option value="Not Processed">Not Processed</option>
                                        <option value="Cash On Delivery">Cash On Delivery</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Dispatch">Dispatch</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {showOrderInTable(order)}
                </div>)
            })}
        </>
    )
}
export default Orders;