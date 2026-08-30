// import API from "./api";

// export const getAdminOrders = () =>
//   API.get("orders/order/");

// export const getAdminRiders = () =>
//   API.get("accounts/riders/");

// export const getAvailableRiders = () =>
//   API.get("accounts/riders/available/");

// export const assignRider = (orderId, riderId) =>
//   API.patch(
//     `orders/order/${orderId}/assign-rider/`,
//     {
//       rider: riderId,
//     }
//   );  

// export const getAdminWarehouses = () =>
//   API.get("inventory/warehouses/");

// export const createWarehouse = (data) =>
//   API.post("inventory/warehouses/", data);

// export const updateWarehouse = (id, data) =>
//   API.patch(`inventory/warehouses/${id}/`, data);

// export const deleteWarehouse = (id) =>
//   API.delete(`inventory/warehouses/${id}/`);

// export const getWarehouseStock = (id) =>
//   API.get(`inventory/warehouses/${id}/stock/`);  


// // ===============================
// // ADMIN INVENTORY
// // ===============================

// export const getAdminInventory = () =>
//   API.get("inventory/stocks/");

// export const getLowStock = () =>
//   API.get("inventory/stocks/low-stock/");

// export const createInventory = (data) =>
//   API.post("inventory/stocks/", data);

// export const updateInventory = (id, data) =>
//   API.patch(`inventory/stocks/${id}/`, data);

// export const deleteInventory = (id) =>
//   API.delete(`inventory/stocks/${id}/`);


// // ===============================
// // ADMIN ORDER LIFECYCLE
// // ===============================

// export const startDelivery = (orderId) =>
//   API.patch(
//     `orders/order/${orderId}/start-delivery/`
//   );

// export const markOrderDelivered = (orderId) =>
//   API.patch(
//     `orders/order/${orderId}/delivered/`
//   );

// export const cancelAdminOrder = (orderId) =>
//   API.patch(
//     `orders/order/${orderId}/cancel/`
//   );






import API from "./api";

// ============================================================
// ADMIN - ORDERS
// ============================================================

export const getAdminOrders = () =>
  API.get("orders/order/");


// ============================================================
// ADMIN - RIDERS
// ============================================================

export const getAdminRiders = () =>
  API.get("accounts/riders/");

export const getAvailableRiders = () =>
  API.get("accounts/riders/available/");

export const assignRider = (orderId, riderId) =>
  API.patch(
    `orders/order/${orderId}/assign-rider/`,
    {
      rider: riderId,
    }
  );


// ============================================================
// ADMIN - WAREHOUSES
// ============================================================

export const getAdminWarehouses = () =>
  API.get("inventory/warehouses/");

export const createWarehouse = (data) =>
  API.post("inventory/warehouses/", data);

export const updateWarehouse = (id, data) =>
  API.patch(
    `inventory/warehouses/${id}/`,
    data
  );

export const deleteWarehouse = (id) =>
  API.delete(
    `inventory/warehouses/${id}/`
  );

export const getWarehouseStock = (id) =>
  API.get(
    `inventory/warehouses/${id}/stock/`
  );


// ============================================================
// ADMIN - INVENTORY
// ============================================================

export const getAdminInventory = () =>
  API.get("inventory/stocks/");

export const getLowStock = () =>
  API.get("inventory/stocks/low-stock/");

export const createInventory = (data) =>
  API.post(
    "inventory/stocks/",
    data
  );

export const updateInventory = (id, data) =>
  API.patch(
    `inventory/stocks/${id}/`,
    data
  );

export const deleteInventory = (id) =>
  API.delete(
    `inventory/stocks/${id}/`
  );


// ============================================================
// ADMIN - ORDER LIFECYCLE
// ============================================================

// Admin can cancel an order
export const cancelAdminOrder = (orderId) =>
  API.patch(
    `orders/order/${orderId}/admin-cancel/`
  );