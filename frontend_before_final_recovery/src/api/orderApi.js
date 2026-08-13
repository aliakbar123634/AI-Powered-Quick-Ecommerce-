import API from "./api";

export const allCart = () =>
  API.get("orders/cart/");

export const addToCart = (data) =>
  API.post("orders/cart/add/", data);


export const updateCartItem = (data) =>
  API.patch("orders/cart/update/", data);

export const removeCartItem = (data) =>
  API.delete("orders/cart/remove/", {
    data: data,
  });
export const getOrders=(data)=>
  API.get("orders/order/" )  

export const createOrder=(data)=>
  API.post("orders/order/create/" , data)

export const getOrderDetail = (id) =>
  API.get(`orders/order/${id}/`);

export const cancelOrder = (id) =>
  API.patch(`orders/order/${id}/cancel/`);


export const getAddresses = () =>
  API.get("accounts/addresses/");





export const createPayment = (data) => {

  return API.post(
    // "/payments/payment/create-payment/",
    "orders/payment/create-payment/",
    data
  );

};

export const stripeCheckout = (id) =>
  API.post(
    // `orders/payment/${id}/stripe-checkout/`
    `orders/payment/${id}/stripe-checkout/`
  );


export const paymentSuccess = (id, data) =>
  API.patch(
    `payments/payments/${id}/success/`,
    data
  );
export const getPaymentDetail = (id) => {

  return API.get(
    `orders/payment/${id}/`
  );

};

export const paymentFailed = (id) =>
  API.patch(
    `payments/payments/${id}/failed/`
  );