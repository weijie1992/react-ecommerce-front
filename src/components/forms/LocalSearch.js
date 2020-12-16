import React from "react";

const LocalSearch = ({keyword,setKeyword}) => {

      //step 3
      const handleSearchChange= (event) => {
        event.preventDefault();
        setKeyword(event.target.value.toLowerCase());//store in state in lower case for searching
    }

    return (
        <div>
            <input
            type="search"
            placeholder="Filter"
            value={keyword}
            onChange={handleSearchChange}
            className="form-control mb-4"
            />
        </div>
    );
}

export default LocalSearch;