import React,{useState,useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {createProduct} from "../../../functions/product";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import {getCategories,getCategorySubs} from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import {LoadingOutlined} from "@ant-design/icons";
const initialState = {
    title:"",
    description:"",
    price:"",
    categories:[],
    category:"",
    subs:[],
    quantity:"",
    images:[],
    shipping:"",
    colors:["Black", "Brown", "Silver", "White", "Blue"],
    brands:["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color:"",
    brand:""
};
const ProductCreate = (props) => {


    
    const [values, setValues] = useState(initialState);
    const [subOptions,setSubOptions] = useState([]);
    const [showSub, setShowSub] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useSelector((state)=>{
        return state.user;
    });

    const loadCategories = () => {
        getCategories().then(res => {
            setValues({...values,categories:res.data});
        });
    }

    useEffect(()=> {
       loadCategories();
       
    },[]);

    const handleSubmit = (event) => {
        event.preventDefault();
        createProduct(values,user.token)
        .then((res)=>{
            console.log(res);
            //toast.success(`${res.data.title} is created`);
            window.alert(`${res.data.title} is created`);
            window.location.reload();
            //setValues(initialState); //setValus will not reset the select input
            //props.history.push("/admin/dashboard");
        })
        .catch((err)=> {
            console.log(err);
            toast.error(err.response.data.err);
            // if(err.response.status===400) {
            //     toast.error("Fail to create product");
            // }
        });
    };

    const handleChange = (event) => {
        //the first spread parameter ...values return the state object the second parameter will then update the individual states values in the state object.
        setValues({...values,[event.target.name]:event.target.value});
        console.log("handleChange",values);
       
    };

    const handleCategoryChange = (event) => {
        //the first spread parameter ...values return the state object the second parameter will then update the individual states values in the state object. sub:[] is to reset sub once category was click again.
        setValues({...values,subs:[],category:event.target.value});
        //Fetch subcategories based on selected category
        getCategorySubs(event.target.value)
        .then((res)=>{
            console.log(res);
            //setValues({...values,subs:res.data});
            setSubOptions(res.data);
        })
        .catch((err)=>{
            console.log(err);
            if(err.response.status===400) {
                toast.error(err.message);
            }
        });
        
        setShowSub(true);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col-md-10"><h4>Product Create Form</h4>
                    <hr/>
                {loading?<LoadingOutlined/>:<div className="p-3">
                    <FileUpload
                    values={values}
                    setValues={setValues}
                    setLoading={setLoading} 
                    />
                </div>}
                <ProductCreateForm
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleCategoryChange={handleCategoryChange}
                values={values}
                setValues={setValues}
                subOptions={subOptions}
                showSub={showSub}
                />
                </div>
            </div>
        </div>
    );
}
export default ProductCreate;