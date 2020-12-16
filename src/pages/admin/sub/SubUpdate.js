import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {getSub, updateSub} from "../../../functions/sub";
import {getCategories,getCategory} from "../../../functions/category";
import {toast} from "react-toastify";
import CategoryForms from "../../../components/forms/CategoryForm";
import {useSelector} from "react-redux";
const SubUpdate = (props) => {

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [loading,setLoading] = useState(false);
    const [parent, setParent] = useState("");

    const user = useSelector((state) => {
        return state.user;
    })

    const loadCategories = () => {
        getCategories()
        .then(res=> {
            console.log(res.data);
            setCategories(res.data);
        });
    }

    const loadSubs = () => {
        getSub(props.match.params.slug)
        .then((res) => {
            console.log(res.data);
            setName(res.data.name);
            setParent(res.data.parent);
        })
        .catch((err) => {
            console.log(err);
            if(err.response.status === 400) {
                toast.error(err.message);
            }
        })
    }
    
    useEffect(()=>
    {
        loadCategories();
        loadSubs(); 
    }
    ,[]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        updateSub(props.match.params.slug,{name:name,parent:parent},user.token)
        .then((res)=>{
            setLoading(false);
            console.log(res.data);
            toast.success("Successfully Update");
            props.history.push("/admin/sub");
        })
        .catch((err)=>{
            setLoading(false);
            console.log(err);
            if(err.response.status===400) {
                toast.error("Fail to Update")
            }
        });
    };

    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>

                <div className="col">
                    {loading?<h4 className="text-danger">loading</h4>:<h4>Update Category</h4>}
                    <div className="form-group">
                        <label>Parent category</label>
                        <select name="category" className="form-control" onChange={(e)=>{return setParent(e.target.value)}}>
                            {categories.length>0 && categories.map((category)=>{
                                return <option 
                                key={category._id} 
                                value={category._id}
                                selected={category._id===parent}
                                >{category.name}</option>
                            })}
                        </select>
                    </div>                    
                    <CategoryForms
                    name={name}
                    setName={setName}
                    handleSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
    
}
export default SubUpdate;