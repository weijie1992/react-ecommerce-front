import React from "react";
import {Select} from "antd";
const {Option} = Select;

const ProductUpdateForm = ({handleSubmit,handleChange,values,setValues,categories,subOptions,arrayOSubs,setArrayOSubs,handleCategoryChange,selectedCategory}) => {
    console.log(values);
    //destructure 
    const {title,description,price,category,subs,quantity,images,shipping,colors,brands,color,brand} = values;
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input 
                type="text"
                name="title"
                className="form-control"
                value={title}
                onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <input 
                type="text"
                name="description"
                className="form-control"
                value={description}
                onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input 
                type="number"
                name="price"
                className="form-control"
                value={price}
                onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>shipping</label>
                <select
                value={shipping}
                name="shipping"
                className="form-control"
                onChange={handleChange}
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>
            <div className="form-group">
                <label>quantity</label>
                <input 
                type="number"
                name="quantity"
                className="form-control"
                value={quantity}
                onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Color</label>
                <select
                name="color"
                value={color}
                className="form-control"
                onChange={handleChange}
                >
                    {
                        colors.map((c)=>{
                            return (<option key={c} value={c}>{c}</option>);
                        })
                    }
                </select>
            </div>
            <div className="form-group">
                <label>Brand</label>
                <select
                name="brand"
                value={brand}
                className="form-control"
                onChange={handleChange}
                >
                    {
                        brands.map((b)=>{
                            return (<option key={b} value={b}>{b}</option>);
                        })
                    }
                </select>
            </div>

            <div className="form-group">
                <label>Category</label>
                <select
                    name="category"
                    className="form-control"
                    onChange={handleCategoryChange}
                    value={selectedCategory?selectedCategory:category._id}
                >
                    {categories.map((c)=>(<option key={c._id} value={c._id}>{c.name}</option>))}
                </select>
            </div>

            <div>
                <label>SubCategories</label>
                <Select
                mode="multiple"
                style={{width:"100%"}}
                placeholder="Please Select"
                value={arrayOSubs}
                onChange={(value)=>{setArrayOSubs(value)}}
                >
                    {subOptions.length > 0 &&
                    subOptions.map((subOption) => {
                        return (<Option key={subOption._id} value={subOption._id}>{subOption.name}</Option>)
                    })
                    }
                </Select>
            </div>


            
            <button className="btn btn-outline-info">
                Save
            </button>
        </form>
    )
};

export default ProductUpdateForm;