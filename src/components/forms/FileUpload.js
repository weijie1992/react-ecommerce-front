import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import {useSelector} from "react-redux";
import { toast } from "react-toastify";
import {Avatar,Badge} from "antd";

const FileUpload = ({values,setValues,setLoading}) => {
    const user = useSelector((state)=>
        {
            return state.user
        }
    )
    const fileUploadResize = (event) => {
        //resize  
        let files = event.target.files;
        let allUploadedFiles = values.images;
        
        if(files) {
            setLoading(true);
            for(let i = 0; i<files.length; i++) {
                Resizer.imageFileResizer(files[i],720,720,"JPEG",100,0,
                (uri)=> {
                    //send back to server from cloudinary
                    axios.post(`${process.env.REACT_APP_API}/uploadimages`
                    ,{image:uri}
                    ,{headers: {authtoken:user.token}})
                    .then((res)=>{
                        console.log("image upoad res data",i);
                        setLoading(false);
                        allUploadedFiles.push(res.data);
                        setValues({...values, images:allUploadedFiles});//update local state
                    })
                    .catch((err)=>{
                        console.log(err);
                        setLoading(false);
                        toast.error("Cloudinary error:", err.message);
                    })
                },
                "base64");
            }
            
        }
    };

    const handleImageRemove = (public_id) => {
        setLoading(true);
        
        axios.post(`${process.env.REACT_APP_API}/removeimages`
        ,{public_id:public_id}
        ,{headers:{authtoken:user.token}})
        .then((res)=>{
            setLoading(false);
            const images = values.images;
            let filteredImages = images.filter((image)=>{
                return image.public_id!==public_id;
            });
            setValues({...values,images:filteredImages});
        })
        .catch((err)=>{
            setLoading(false);
            console.log(err);
            toast.error("Delete Error :", err);
        })
    };

    return (
        <>
            <div className="row">
                {values.images && values.images.map((image)=> {
                    return (
                    <Badge 
                    count="X" 
                    key={image.public_id} 
                    onClick={()=>handleImageRemove(image.public_id)}
                    style={{cursor:"pointer"}}
                    >
                        <Avatar 
                        key={image.public_id} 
                        src={image.url} 
                        size={100} 
                        className="ml-3 mb-2"
                        shape="square"
                        />
                    </Badge>
                    );
                })}
            </div>
            <div className="row">
                <label className="btn btn-primary btn-raised">Choose File
                    <input
                    type="file"
                    multiple
                    hidden
                    accept="images/*"
                    onChange={fileUploadResize}
                    />
                </label>
            </div>
        </>
    )
}

export default FileUpload;