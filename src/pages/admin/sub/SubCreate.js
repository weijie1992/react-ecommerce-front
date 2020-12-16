import React, { useEffect,useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {getCategories} from "../../../functions/category";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import {createSub,removeSub,getSubs} from "../../../functions/sub";
import {useSelector} from "react-redux";
import { toast } from "react-toastify";
import {EditOutlined,DeleteOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

const SubCreate = () => {

    //load user state, more important for auth token
    const user = useSelector((state) => {
        //console.log(state.user);
        return state.user;
    });

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");
    const [keyword, setKeyword] = useState("");
    const [subs,setSubs] = useState([]);

    useEffect(()=> {
        //load category dropdownlist
        loadCategories();
        loadSubs();
    },[]);

    const loadCategories = () => {
        getCategories()
        .then(res=> {
            console.log(res.data);
            setCategories(res.data);
        });
    }

    const loadSubs = () => {
        getSubs()
        .then((res)=>{
            console.log(res.data);
            setSubs(res.data);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        createSub({name:name,parent:category}
            ,user.token
        )
        .then((res)=> {
            setLoading(false);
            console.log(res);
            toast.success("Successfully Created!");
            loadSubs();
        })
        .catch((err)=>{
            setLoading(false);
            console.log(err);
            if(err.response.status === 400) {
                toast.error(err.response.data)
            }
        });
    };

    //step 4 function to use on map 
    const searched = (keyword) => (sub) => sub.name.toLowerCase().includes(keyword);

    const handleRemove = (slug) => {
        //load confirmation box
        if(window.confirm("Delete?")) {
            setLoading(true);
            removeSub(slug, user.token)
            .then((res) => {
                setLoading(false);
                console.log(res);
                toast.success("Successfully Removed!");
                loadSubs();
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                if(err.response.status === 400) {
                    toast.error(err.response.data)
                }
            });
        }
    };


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col">
                    {loading?<h4 className="text-danger">loading</h4>:<h4>Create Sub Category</h4>}

                    <div className="form-group">
                        <label>Parent category</label>
                        <select name="category" className="form-control" onChange={(e)=>{return setCategory(e.target.value)}}>
                            <option>Please Select</option>
                            {
                                categories.length > 0 && categories.map((category) => {
                                    return (
                                    <option 
                                    key={category._id} 
                                    value={category._id}>
                                        {category.name}
                                    </option> 
                                    );
                                }
                                )
                            }
                        </select>
                    </div>
                    <CategoryForm
                     name={name} 
                     setName={setName}
                     handleSubmit = {handleSubmit}/>

                <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
                {subs.filter(searched(keyword)).map((sub)=> {
                        return (
                        <div className="alert alert-secondary" key={sub._id}>
                            {sub.name}
                            <span className="btn btn-sm float-right">
                                <DeleteOutlined className="text-danger" onClick={()=>{
                                    console.log("delete clicked");
                                    return handleRemove(sub.slug)}
                                    }/>
                            </span>
                            <span className="btn btn-sm float-right">
                                <Link to={`/admin/sub/${sub.slug}`}>
                                    <EditOutlined className="text-warning"/>
                                </Link>
                            </span>
                        </div>
                        )
                    })}

                </div>
            </div>
        </div>
    );
}

export default SubCreate;