import React,{useEffect, useState} from "react";
import UserNav from "../../components/nav/UserNav";
import {getUserOrders} from "../../functions/user";
import {useSelector} from "react-redux";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import Invoice from "../../components/order/Invoice";

const History = () => {
    const {user} = useSelector((state)=>{return ({...state})});
    const [orders, setOrders] = useState([]);

    const loadUserOrders = async() => {
        try {
            const res = await getUserOrders(user.token);
            console.log(res.data);
            setOrders(res.data);
        }
        catch (err) {
            //redirect
        }
        
    }

    useEffect(() => {
        loadUserOrders();
    },[]);

    const showDownloadLink = (order) => {
        return(
                <PDFDownloadLink 
                    document={
                        <Invoice order={order}/>
                    }
                    fileName="invoice.pdf"
                    className="btn btn-sm btn-block btn-outline-primary"
                >
                    Download PDF
                </PDFDownloadLink>
            );
    };

    

    const showEachOrders = () => {
        return (orders.map((order)=> {
            return (
                <div key={order._id} className="m-5 p-3 card">
                    <ShowPaymentInfo order={order}/>
                    {showOrderInTable(order)}
                    <div className="row">
                        <div className="col">
                            {showDownloadLink(order)}
                        </div>
                    </div>
                </div>
                );
            })
        )
    }

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
                    {order.products.map((product,i)=> {
                        return (
                            <tr key={i}>
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
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav/>
                </div>
                <div className="col text-center">
                    <h4>{orders.length>0?("User purchase orders"):("No purchase order")}</h4>
                    {showEachOrders()}
                </div>
            </div>
        </div>
    )
}
export default History;