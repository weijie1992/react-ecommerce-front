import React from "react";
import {Card} from "antd";
import laptop from "../../Images/computer/laptop.png";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons"
import {Link} from "react-router-dom";
const {Meta} = Card;


const AdminProductCard = ({product, handleRemove}) => {
    const {title, description, images,slug} = product;
    return (
        <Card
            hoverable
            cover={
                <img 
                src={images&&images.length>0?images[0].url:laptop} 
                style={{height:"150px", objectFit:"cover"}}
                className="p-1"/>
            }
            actions={[
                <Link to={`/admin/product/${slug}`}>
                    <EditOutlined
                    className="text-danger" 
                    />
                </Link>
                ,
                <DeleteOutlined 
                    className="text-danger" 
                    onClick={()=>handleRemove(slug)}
                />
            ]}
        >
            <Meta 
            title={title}
            description={`${description && description.substring(0,15)}...`} />
        </Card>
    );
};

export default AdminProductCard;