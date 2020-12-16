import React from "react";

//handleSubmit,name,setName destructure from props
const CategoryForm =({handleSubmit,name,setName}) => {

    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input
                type="text"
                className="form-control"
                required
                onChange={(event)=> {return setName(event.target.value)}}
                value={name}
                placeholder="Enter Category Name"/>
            </div>
            
            <button className="btn btn-outline-primary">
                Save
            </button>
            </form>
        );

}
export default CategoryForm