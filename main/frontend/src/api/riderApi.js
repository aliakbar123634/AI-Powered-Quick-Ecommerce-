import API from "./api";
// import axios from "axios";



export const getMyOrders = () => {
    return API.get(
        "/accounts/riders/my-orders/"
    );
};

export const acceptOrder = (id) => {
    return API.patch(
        `/accounts/riders/${id}/accept/`
    );
};

export const pickedUpOrder = (id) => {
    return API.patch(
        `/accounts/riders/${id}/picked-up/`
    );
};

export const outForDeliveryOrder = (id) => {
    return API.patch(
        `/accounts/riders/${id}/out-for-delivery/`
    );
};

export const deliveredOrder = (id) => {
    return API.patch(
        `/accounts/riders/${id}/delivered/`
    );
};