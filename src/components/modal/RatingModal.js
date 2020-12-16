import { formatCountdown } from "antd/lib/statistic/utils";
import React, { useState } from "react";
import {Modal, Button} from "antd";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {StarOutlined} from "@ant-design/icons"
import {useHistory, useParams} from "react-router-dom";

const RatingModal = ({children}) => {

    let history = useHistory();
    let params = useParams();

    const user = useSelector((state)=>{
        return state.user;
    });
    const [modalVisible, setModalVisible] = useState(false);

    const handleModal = () => {
        if(user && user.token) {
            setModalVisible(true);
        } else {
            history.push( //this will redirect to the current page after user logged in. state object will need to pass current URL
                {
                    pathname:"/login",
                    state:{ from:`/product/${params.slug}`}
                }
            );
        }
    }
    return(
        <>
            <div onClick={()=> handleModal()}>
                <StarOutlined className="text-danger" /> <br/>
                {user?"Leave rating":"Login to leave rating"}
            </div>
                <Modal
                    title="Leave your rating"
                    centered
                    visible={modalVisible}
                    onOk={()=>{
                        setModalVisible(false);
                        toast.success("Thank you for submiting rating!")
                    }}
                    onCancel={()=>{
                        setModalVisible(false);
                    }}
                    >
                    {children}
                </Modal>
            
        </>
    )
}
export default RatingModal;