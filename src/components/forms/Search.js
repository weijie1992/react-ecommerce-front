import React from "react";
import {useHistory} from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import {SearchOutlined} from "@ant-design/icons";

const Search = () => {
    const dispatch = useDispatch();

    const search = useSelector((state) => {
        return state.search;
    });
    const text = search.text;

    const history = useHistory();

    //handleChange will update to redux store as our search query is displaying result in real time.
    const handleChange = (event) => {
        dispatch({
            type:"SEARCH_QUERY",
            payload:{
                text: event.target.value
            }
        });
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        history.push(`/shop?${text}`); //send search query through url
    }
    
    return (
        <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
            <input type="search" value={text} className="form-control mr-sm-2" placeholder="Search" onChange={handleChange}/>
            <SearchOutlined onClick={handleSubmit} style={{cursor:"pointer"}}/>
        </form>
    )
}
export default Search;