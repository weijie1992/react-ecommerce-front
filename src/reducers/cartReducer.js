//get InitialState, example user can close their browser and return without logging in
let initialState = [];
if(typeof window !== "undefined") {
    if(localStorage.getItem("cart")) {
        initialState = JSON.parse(localStorage.getItem("cart"));
    } else {
        initialState = [];
    }
}

export const cartReducer = (state=initialState,action) => {
    //load cart item from local storage
    switch(action.type) {
        case "ADD_TO_CART":
            return action.payload;
        default:
            return state;
    }
}