import React,{useState,useEffect} from "react";
import { toast } from "react-toastify";
import AdminNav from "../../../components/nav/AdminNav";
import {getProduct,updateProduct} from "../../../functions/product";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import {getCategories,getCategorySubs} from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import {LoadingOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";

const initialState = {
    title:"",
    description:"",
    price:"",
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

const ProductUpdate = (props) => {
    
    const user = useSelector((state)=> {
        return state.user;
    })
    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [subOptions,setSubOptions] = useState([]);
    const [arrayOSubs,setArrayOSubs] = useState([]);
    const [selectedCategory,setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const slug = props.match.params.slug;

    useEffect(()=>{
        loadProduct();
        loadCategories();
    },[]);

    const loadProduct = () => {
        getProduct(slug)
        .then((product)=>{
            setValues({...values,...product.data});//need to understand how spread operator works
            //console.log("*****Loading Products********",product.data);
            //retrieve all sub category from category
            getCategorySubs(product.data.category._id)
            .then((res)=>{
                setSubOptions(res.data);
            })
            .catch((err) => {
                toast.error("Error");
            });
            //
            let defaultSubOptionsArray = [];
            product.data.subs.map((sub)=>{
                return defaultSubOptionsArray.push(sub._id);
            });
            console.log("defaultSubOptionsArray",defaultSubOptionsArray);
            setArrayOSubs((prev)=>defaultSubOptionsArray);
            
        })
        .catch((err)=>{
            console.log(err);
            toast.error("Error retrieving product: ", err.message);
        })
    }

    const loadCategories = () => {
        getCategories().then(res => {
            setCategories(res.data);
            console.log("*****Loading Categories********",res.data);
        });
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        //update setValue State
        values.subs = arrayOSubs;
        values.category = selectedCategory?selectedCategory:values.category._id;
        
        updateProduct(slug,values,user.token)
        .then((res)=> {
            setLoading(false);
            console.log(res);
            toast.success(`${res.data.title} has successfully update`);
            props.history.push("/admin/products");
        })
        .catch((err) => {
            setLoading(false);
            toast.error("Error Updating Category: ", err.message);
        })
    };
    const handleChange = (event) => {
        //the first spread parameter ...values return the state object the second parameter will then update the individual states values in the state object.
        setValues({...values,[event.target.name]:event.target.value});
        console.log("handleChange",values);
    };
    
    const handleCategoryChange =(event) => {
        event.preventDefault();
        setValues({...values,sub:[]});

        setSelectedCategory(event.target.value);

        getCategorySubs(event.target.value)
        .then((res) => {
            setSubOptions(res.data);
        })
        .catch((err)=>{
            console.log(err);
            toast.error("Error Get Category Subs: ", err.message);
        });
        if(values.category._id === event.target.value) {
            loadProduct();//if user click back the same category, this will show default sub categories
        }
        //clear categories
        setArrayOSubs([]);
    }
    
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col-md-10">
                    <h4>Product Update</h4>
                    <hr />
                    {loading?<LoadingOutlined/>:<FileUpload
                    values={values}
                    setValues={setValues}
                    setLoading={setLoading} 
                    />}
                    <ProductUpdateForm
                    values={values} 
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    setValues={setValues}
                    categories={categories}
                    subOptions={subOptions}
                    arrayOSubs={arrayOSubs}
                    setArrayOSubs={setArrayOSubs}
                    handleCategoryChange={handleCategoryChange}
                    selectedCategory={selectedCategory}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductUpdate;