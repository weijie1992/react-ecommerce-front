import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import {getSubs} from "../../functions/sub";

const SubList = () => {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSubs()
        .then((res)=>{
            setSubs(res.data);
            setLoading(false);
        })
        .catch((err)=> {
            console.log(err);
            setLoading(false);
        })
    },[]);

    const showSubs = () => {
        return (
            subs.map((sub) => {
                return (
                    <Link to={`/sub/${sub.slug}`} className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3" key={sub._id}>
                        {sub.name}
                    </Link>
                );
            })
        )
    } 
        
     
    return (
        <div className="container">
            <div className="row">
                {loading?(<h4 className="text-center text-danger">Loading</h4>):(showSubs())}
            </div>
        </div>
    )
}
export default SubList;