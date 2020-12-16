import React,{useState,useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {createCategory,getCategories,removeCategory} from "../../../functions/category";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {EditOutlined,DeleteOutlined} from "@ant-design/icons";
import CategoryForms from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const CategoryCreate = () => {
    const user = useSelector((state) => {
        console.log(state.user);
        return state.user;
    });
    const [name, setName] = useState("");
    const [loading,setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    //step1 searhing/filtering
    const [keyword, setKeyword] = useState("");

    useEffect(()=> {
        loadCategories();
    },[]);

    const loadCategories = () => {
        getCategories().then(res => {
            setCategories(res.data);
        });
    }

    const handleRemove = async(slug) => {
       
        if(window.confirm("Delete?")) {
            setLoading(true);
            removeCategory(slug,user.token)
            .then((res)=>{
                setLoading(false);
                toast.success(`${res.data.name} deleted`);
                loadCategories();
            })
            .catch((err)=> {
                setLoading(false);
                console.log(err);
                if(err.response.status === 400) {
                    toast.error(err.response.data)
                }
            });
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        createCategory({name:name},user.token)
        .then((res)=> {
            setLoading(false);
            setName("");
            toast.success(`${res.data.name} is created`);
            loadCategories();
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
            if(err.response.status === 400) {
                toast.error(err.response.data)
            }
        });
    }

  

    //step 4 function to use on map 
    const searched = (keyword) => (category) => category.name.toLowerCase().includes(keyword);
    

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col">
                    {loading?<h4 className="text-danger">loading</h4>:<h4>Create Category</h4>}
                    
                    <CategoryForms 
                    handleSubmit={handleSubmit}
                    name={name}
                    setName={setName}/>
                   <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
                    {categories.filter(searched(keyword)).map((category)=> {
                        return (
                        <div className="alert alert-secondary" key={category._id}>
                            {category.name}
                            <span className="btn btn-sm float-right">
                                <DeleteOutlined className="text-danger" onClick={()=>{
                                    console.log("delete clicked");
                                    return handleRemove(category.slug)}
                                    }/>
                            </span>
                            <span className="btn btn-sm float-right">
                                <Link to={`/admin/category/${category.slug}`}>
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
export default CategoryCreate;