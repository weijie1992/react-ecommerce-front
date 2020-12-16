import axios from "axios";

export const userCart = async(cart,authtoken)  => {
    return await axios.post(`${process.env.REACT_APP_API}/user/cart`, {cart:cart}, {headers: {
        authtoken:authtoken
    }});
}

export const getUserCart = async(authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/cart`, {headers: {
        authtoken:authtoken
    }});
}

export const emptyUserCart = async(authtoken) => {
    return await axios.delete(`${process.env.REACT_APP_API}/user/cart`, {headers: {
        authtoken:authtoken
    }});
};

export const saveUserAddress = async(authtoken,address) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/address`,address, {headers: {
        authtoken:authtoken
    }});
}

export const applyCoupon  = async(authtoken,coupon) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/cart/coupon`,coupon, {headers: {
        authtoken:authtoken
    }});
}

export const createOrder = async (stripeResponse,authtoken) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/order`,{stripeResponse}, {headers: {
        authtoken:authtoken}}
    )
}
export const getUserOrders = async(authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/orders`, {headers: {
        authtoken:authtoken
    }});
}
export const getWishlist = async(authtoken) => {
    return await axios.get(`${process.env.REACT_APP_API}/user/wishlist`, {headers: {
        authtoken:authtoken
    }});
}
export const removeWishlist = async(authtoken,productId) => {
    return await axios.put(`${process.env.REACT_APP_API}/user/wishlist/${productId}`,{},{headers: {
        authtoken:authtoken
    }});
}
export const addToWishlist = async(authtoken,productId) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/wishlist`,{productId:productId},{headers: {
        authtoken:authtoken
    }});
}

export const createCashOrderForUser = async (authtoken, COD, couponTrueOrFalse) => {
    return await axios.post(`${process.env.REACT_APP_API}/user/cash-order`,{couponApplied:couponTrueOrFalse,COD:COD}, {headers: {
        authtoken:authtoken}}
    )
}