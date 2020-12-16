import React,{useState,useEffect} from "react";
import {getProductsByCount,fetchProductsByFilter} from "../functions/product";
import {useSelector,useDispatch} from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import {toast} from "react-toastify";
import {Menu, Slider,Checkbox,Radio} from "antd";
import {DollarOutlined,DownSquareOutlined,StarOutlined} from "@ant-design/icons";
import {getCategories} from "../functions/category";
import Star from "../components/forms/Star"
import {getSubs} from "../functions/sub";
const {SubMenu,ItemGroup} = Menu;

const Shop = () => {

    let dispatch = useDispatch();
    const search = useSelector((state)=>{
        return state.search;
    });
    const text = search.text;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0,0]);
    const [ok,setOk] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [star, setStar] = useState("");
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState("");
    const [brands,setBrands] =useState(["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"]);
    const [brand, setBrand] = useState("");
    const [colors,setColors] =useState(["Black", "Brown", "Silver", "White", "Blue"]);
    const [color, setColor] = useState("");
    const [shipping, setShipping] = useState("");

    const fetchProducts =async(arg) => {
        try {
            const res = await fetchProductsByFilter(arg);
            setProducts(res.data);
        }
        catch(error) {
            console.log(error);
        }
    }

    const loadAllProduct = async () => {
        try {
            setLoading(true);
            const res = await getProductsByCount(12);
            setLoading(false);
            setProducts(res.data);
        }
        catch(err) {
            setLoading(false);
            console.log(err);
            toast.error("Fail to retrieve product: ", err.message);
        }
    };

    const loadCategories = async () => {
        const res = await getCategories();
        setCategories(res.data);
    }

    const loadSubs = async () => {
        const res = await getSubs();
        setSubs(res.data);
    }

    //load product when search button was clicked and category and sub categories
    useEffect(() => {
        loadAllProduct();
        loadCategories();
        loadSubs();
    },[]);

    //load product base on nav search
    useEffect(()=> {

        console.log(`text = ${text} categoryIds = ${categoryIds} star = ${star} price = ${price} sub = ${sub}`);
        if(text === ""&&categoryIds.length === 0&&star === ""&&sub === "" && price[0,0] === 0 && price[0,1] === 0 && brand ==="" && color ==="" && shipping==="") {
            console.log("herehere");
            loadAllProduct();
        } else {
            const delayed= setTimeout(() => {
                fetchProducts({query:text});
            },300);
            return () => clearTimeout(delayed);
        }
        
    },[text]);

    //load product base on price
    useEffect(()=> {
        fetchProducts({price:price});
    },[ok]);

    //clear search query when slider is moved
    const handleSlider = (value) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload: {text:""}
        });

        setCategoryIds([]);

        setStar("");

        setSub("");

        setBrand("");

        setColor("");

        setShipping("");
        
        setPrice(value);

        setTimeout(() => {
            setOk(!ok);
        },300);
    }
    
    //load product base on category
    const showCategories = () => {
       return categories.map((category) => {
           return (
                <div key={category._id}>
                    <Checkbox 
                        className="pb-2 pl-4 pr-4" 
                        value={category._id} 
                        name="category"
                        onChange={handleCheck} 
                        checked={categoryIds.includes(category._id)}
                    >
                        {category.name}
                    </Checkbox>
                </div>
            );
       });
    };

    const handleCheck = (event) => {

        dispatch({
            type:"SEARCH_QUERY",
            payload:{text:""}
        });

        setPrice([0,0]);

        setStar("");

        setSub("");

        setBrand("");

        setColor("");

        setShipping("");

        let inTheState = [...categoryIds];
        let justChecked = event.target.value;
        let foundIntheState = inTheState.indexOf(justChecked);
        
        if(foundIntheState === -1 ) {
            inTheState.push(justChecked);
        } else {
            inTheState.splice(foundIntheState,1)
        }
        setCategoryIds(inTheState);

        fetchProducts({category:inTheState});
    }

    //show star side menu

    const handleStarClick = (numOfStarClicked) => {
        console.log(numOfStarClicked);
        dispatch({
            type:"SEARCH_QUERY",
            payload: {text:""}
        });

        setPrice([0,0]);

        setCategoryIds([]);

        setSub("");

        setBrand("");

        setColor("");

        setShipping("");
        
        setStar(numOfStarClicked);

        fetchProducts({stars:numOfStarClicked});
    }

    const showStars  = () => {
        return (
            <div className="pr-4 pl-4 pb-2">
                <Star
                    starClick={handleStarClick}
                    numberOfStars={5} 
                />
                <Star
                    starClick={handleStarClick}
                    numberOfStars={4} 
                />
                <Star
                    starClick={handleStarClick}
                    numberOfStars={3} 
                />
                <Star
                    starClick={handleStarClick}
                    numberOfStars={2} 
                />
                <Star
                    starClick={handleStarClick}
                    numberOfStars={1} 
                />
            </div>
        )
    };
    
    //show product base on sub categories
    const handleSubmit = (sub) => {

        dispatch({
            type:"SEARCH_QUERY",
            payload: {text:""}
        });

        setPrice([0,0]);

        setCategoryIds([]);

        setStar("");

        setBrand("");

        setColor("");

        setShipping("");

        setSub(sub);
        fetchProducts({sub:sub._id});
        
    }
    const showSubs = () => {
        return subs.map((sub)=> {
            return (<div key={sub._id} onClick={()=>handleSubmit(sub)} className="p-1 m-1 badge badge-secondary" style={{cursor:"pointer"}}>
                {sub.name}
                </div>);
        })
    }
    //show products base on brands
    const handleBrand = (event) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload: {text:""}
        });

        setPrice([0,0]);

        setCategoryIds([]);

        setStar("");

        setSub("");

        setColor("");

        setShipping("");

        setBrand(event.target.value);
        fetchProducts({brand:event.target.value});
    }
    const showBrands = () => {
        return brands.map((b)=>{
            return (
                <Radio value={b} key={b} checked={b === brand} onChange={handleBrand} className="pb-1 pl-1 pr-4">
                    {b}
                </Radio>
            )
        })
    };
    
    //show products based on color
    const handleColor = (event) => {

        dispatch({
            type:"SEARCH_QUERY",
            payload: {text:""}
        });

        setPrice([0,0]);

        setCategoryIds([]);

        setStar("");

        setSub("");

        setBrand("");

        setShipping("");

        setColor(event.target.value);
        fetchProducts({color:event.target.value});
        

    }
    const showColors = () => {
        return colors.map((c) => {
            return (
                <Radio key={c} value={c} checked={c===color} onChange={handleColor} className="pb-1 pl-1 pr-4">
                    {c}
                </Radio>
            )
        })
    };

    //show products based on shipping
    const handleShippingChange = (event) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload: {text:""}
        });

        setPrice([0,0]);

        setCategoryIds([]);

        setStar("");

        setSub("");

        setBrand("");

        setColor("");

        setShipping(event.target.value);
        fetchProducts({shipping:event.target.value});

    }
    const showShipping = () => {
        return (
            <>  
                <Checkbox 
                className="pb-2 pl-4 pr-4" 
                onChange={handleShippingChange} 
                value="Yes" 
                checked={shipping==="Yes"}>
                    Yes
                </Checkbox>
                <Checkbox 
                className="pb-2 pl-4 pr-4" 
                onChange={handleShippingChange} 
                value="No" 
                checked={shipping==="No"}>
                    No
                </Checkbox>
            </>
        )
    }



    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/Filter</h4>
                    <hr/>
                    <Menu defaultOpenKeys={["slider","category","star","subCategory","brands","colors","shipping"]} mode="inline">
                        <SubMenu key="slider" title={<span className="h6"><DollarOutlined/>Price</span>}>
                            <div>
                                <Slider 
                                className="ml-4 mr-4"
                                tipFormatter={(value)=>`$${value}`}
                                range
                                value={price}
                                onChange={handleSlider}
                                max="4999" />
                            </div>
                        </SubMenu>
                        <SubMenu key="category" title={<span className="h6"><DownSquareOutlined/>Categories</span>}>
                            <div className={{marginTop:"-10px"}}>
                                {showCategories()}
                            </div>
                        </SubMenu>
                        <SubMenu key="star" title={<span className="h6"><StarOutlined/>Rating</span>}>
                            <div className={{marginTop:"-10px"}}>
                                {showStars()}
                            </div>
                        </SubMenu>
                        <SubMenu key="subCategory" title={<span className="h6"><DownSquareOutlined/>Sub Categories</span>}>
                            <div style={{marginTop:"-10px"}} className="pl-4 pr-4">
                                {showSubs()}
                            </div>
                        </SubMenu>
                        <SubMenu key="brands" title={<span className="h6"><DownSquareOutlined/>Brands</span>}>
                            <div style={{marginTop:"-10px"}} className="pl-4 pr-5">
                                {showBrands()}
                            </div>
                        </SubMenu>
                        <SubMenu key="colors" title={<span className="h6"><DownSquareOutlined/>colors</span>}>
                            <div style={{marginTop:"-10px"}} className="pl-4 pr-5">
                                {showColors()}
                            </div>
                        </SubMenu>
                        <SubMenu key="shipping" title={<span className="h6"><DownSquareOutlined/>Shipping</span>}>
                            <div style={{marginTop:"-10px"}} className="pl-4 pr-5">
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>

                </div>
                <div className="col-md-9 pt-2">

                    {loading
                    ?(<h4>Loading</h4>)
                    :(<h4>Products</h4>)
                    }
                    {products&&products.length<1&&<p>No products found</p>}
                    <div className="row pb-5">
                        {products&&products.map((product) => { 
                            return(<div key={product._id} className="col-md-4 mt-3">
                                <ProductCard product={product} />
                            </div>)
                        })}
                    </div>
                </div>
            </div>
            
        </div>
    )
}
export default Shop;