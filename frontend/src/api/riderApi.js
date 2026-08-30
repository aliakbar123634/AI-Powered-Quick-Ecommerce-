

import API from "./api";

// ============================================================
// RIDER - MY ORDERS
// ============================================================

export const getMyOrders = () => {
    return API.get(
        "/accounts/riders/my-orders/"
    );
};

// ============================================================
// RIDER - ORDER DETAIL
// ============================================================

export const getRiderOrderDetail = (orderId) => {
    return API.get(
        `/accounts/riders/${orderId}/order-detail/`
    );
};


// ============================================================
// RIDER - PICKED UP
// ASSIGNED → PICKED_UP
// ============================================================

export const pickedUpOrder = (deliveryId) => {
    return API.patch(
        `/delivery/tracking/${deliveryId}/picked-up/`
    );
};


// ============================================================
// RIDER - OUT FOR DELIVERY
// PICKED_UP → OUT_FOR_DELIVERY
// ============================================================

export const outForDeliveryOrder = (deliveryId) => {
    return API.patch(
        `/delivery/tracking/${deliveryId}/out-for-delivery/`
    );
};


// ============================================================
// RIDER - DELIVERED
// OUT_FOR_DELIVERY → DELIVERED
// ============================================================

export const deliveredOrder = (deliveryId) => {
    return API.patch(
        `/delivery/tracking/${deliveryId}/delivered/`
    );
};

