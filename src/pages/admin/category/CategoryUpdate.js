import React,{useEffect,useState} from "react";
import {getCategory,updateCategory} from "../../../functions/category";
//import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import {useSelector} from "react-redux";
import CategoryForms from "../../../components/forms/CategoryForm";


const CategoryUpdate = (props) => {
    const user = useSelector((state) => {
        return state.user;
    });
    const [name,setName] = useState("");
    const [loading,setLoading] = useState(false);

    const loadCategory = (slug) => {
        getCategory(slug)
        .then((res) => {
            setName(res.data.name); 
        })
        .catch((err)=>{
            console.log(err);
            if(err.response.status === 400) {
                toast.error(err.response.data)
            }
        });
    };

    useEffect(()=> {
        loadCategory(props.match.params.slug);
    },[]);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        updateCategory(props.match.params.slug,{name:name}, user.token)
        .then((res) => {
            setLoading(false);
            setName("");    
            toast.success(`${res.data.name} is updated`);
            props.history.push("/admin/category");
        })
        .catch((err)=>{
            setLoading(false);
            console.log(err);
            if(err.response.status === 400) {
                toast.error(err.response.data)
            }
        })
    }
    

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col">
                    {loading?<h4 className="text-danger">loading</h4>:<h4>Update Category</h4>}
                    <CategoryForms 
                    handleSubmit={handleSubmit}
                    name={name}
                    setName={setName}/>
                    <hr />
                </div>
            </div>
        </div>
    );
}

export default CategoryUpdate;