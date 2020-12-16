import React from 'react';
import StarRating from "react-star-ratings";

export const showAverage = (product) => {
    if(product && product.ratings) {
        let ratingsArray = product.ratings;
        let total = [];
        let length = ratingsArray.length;

        ratingsArray.map((rating)=> {
            return total.push(rating.star);
        });
        let totalReduced = total.reduce((prev,next) => {
            //console.log("Prev",prev,"NEXT",next);
            return prev + next },0 //0 is the starting value
        );
       // console.log("totalReduced",totalReduced);

        let highest = length * 5;

        let result = (totalReduced*5)/highest;

        return(
            <div className="text-center pt-1 pb-3">
                <span>
                    <StarRating
                        rating={result}
                        starDimension="20px"
                        starSpacing="2px"
                        starRatedColor="red"
                        editing={false}
                    />
                    ({product.ratings.length})
                </span>
            </div>
        )
    }
};