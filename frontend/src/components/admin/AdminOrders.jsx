import React, { useEffect, useState } from "react";
import API from "../../api/api";

import {
  getAdminOrders,
  getAvailableRiders,
  assignRider,
  cancelAdminOrder,
} from "../../api/adminApi";

const AdminOrders = () => {
  // ============================================================
  // STATE
  // ============================================================

  const [orders, setOrders] = useState([]);

  const [riders, setRiders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [ridersLoading, setRidersLoading] = useState(false);

  const [error, setError] = useState("");

  // Assign rider
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [selectedRider, setSelectedRider] = useState("");

  const [assigning, setAssigning] = useState(false);

  // Order details
  const [detailsOrder, setDetailsOrder] = useState(null);

  // Lifecycle action
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================================
  // FETCH ORDERS
  // ============================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Django REST Framework may paginate the order endpoint.
      // The old code only used the first `results` page, which is why
      // newly-created orders could exist in Django Admin but not appear
      // on this React admin page.
      let response = await getAdminOrders();
      let data = response?.data;
      let allOrders = [];
      let pageCount = 0;
      const maxPages = 100;
      const visitedUrls = new Set();

      while (data && pageCount < maxPages) {
        pageCount += 1;

        if (Array.isArray(data)) {
          allOrders.push(...data);
          break;
        }

        if (Array.isArray(data.results)) {
          allOrders.push(...data.results);
        }

        const nextUrl = data.next;

        if (!nextUrl || visitedUrls.has(nextUrl)) {
          break;
        }

        visitedUrls.add(nextUrl);
        response = await API.get(nextUrl);
        data = response?.data;
      }

      // Keep every order, remove accidental duplicates, and show newest
      // orders first so a newly-created order appears immediately at top.
      const uniqueOrders = Array.from(
        new Map(
          allOrders
            .filter((order) => order && order.id != null)
            .map((order) => [order.id, order])
        ).values()
      );

      uniqueOrders.sort((a, b) => {
        const dateA = a?.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b?.created_at ? new Date(b.created_at).getTime() : 0;

        if (dateB !== dateA) {
          return dateB - dateA;
        }

        return Number(b?.id || 0) - Number(a?.id || 0);
      });

      setOrders(uniqueOrders);
    } catch (error) {
      console.error("Admin orders error:", error);

      setError(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH AVAILABLE RIDERS
  // ============================================================

  const fetchAvailableRiders = async () => {
    try {
      setRidersLoading(true);

      const response = await getAvailableRiders();

      const data = response.data;

      setRiders(data.results || data || []);
    } catch (error) {
      console.error("Available riders error:", error);

      setRiders([]);
    } finally {
      setRidersLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ============================================================
  // ASSIGN RIDER MODAL
  // ============================================================

  const openAssignModal = async (order) => {
    setSelectedOrder(order);
    setSelectedRider("");

    await fetchAvailableRiders();
  };

  const closeAssignModal = () => {
    if (assigning) return;

    setSelectedOrder(null);
    setSelectedRider("");
  };

  // ============================================================
  // DETAILS DRAWER
  // ============================================================

  const openDetailsDrawer = (order) => {
    setDetailsOrder(order);
  };

  const closeDetailsDrawer = () => {
    if (actionLoading) return;

    setDetailsOrder(null);
  };

  // ============================================================
  // ASSIGN RIDER
  // ============================================================

  const handleAssignRider = async () => {
    if (!selectedOrder) return;

    if (!selectedRider) {
      alert("Please select a rider.");
      return;
    }

    try {
      setAssigning(true);

      await assignRider(
        selectedOrder.id,
        selectedRider
      );

      await fetchOrders();

      setDetailsOrder(null);
      closeAssignModal();

      alert("Rider assigned successfully.");
    } catch (error) {
      console.error("Assign rider error:", error);

      alert(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to assign rider."
      );
    } finally {
      setAssigning(false);
    }
  };

  // ============================================================
  // CANCEL ORDER
  // ============================================================

  const handleCancelOrder = async (order) => {
    if (!order?.id) return;

    if (
      order.status === "DELIVERED" ||
      order.status === "CANCELLED"
    ) {
      alert(
        "This order cannot be cancelled."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel order #${order.order_number}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await cancelAdminOrder(order.id);

      await fetchOrders();

      setDetailsOrder((current) =>
        current
          ? {
              ...current,
              status: "CANCELLED",
            }
          : null
      );

      alert("Order cancelled successfully.");
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      alert(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to cancel order."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "OUT_FOR_DELIVERY":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ============================================================
  // STATUS LABEL
  // ============================================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";

      case "CONFIRMED":
        return "Confirmed";

      case "OUT_FOR_DELIVERY":
        return "Out for delivery";

      case "DELIVERED":
        return "Delivered";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  };

  // ============================================================
  // PAYMENT STYLE
  // ============================================================

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "FAILED":
        return "bg-red-50 text-red-700 border-red-200";

      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // ============================================================
  // ACTION BUTTONS
  // ============================================================

  const renderLifecycleActions = (order) => {
    if (order.status === "PENDING") {
      return (
        <span className="text-xs text-slate-400">
          Waiting for confirmation
        </span>
      );
    }

    if (order.status === "CONFIRMED" && !order.rider) {
      return (
        <button
          onClick={() => openAssignModal(order)}
          className="
            px-3 py-2 rounded-lg
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white text-xs font-semibold
            shadow-md shadow-blue-500/20
            hover:opacity-90 transition
          "
        >
          Assign Rider
        </button>
      );
    }

    if (order.status === "CONFIRMED" && order.rider) {
      return (
        <span className="text-xs font-semibold text-blue-600">
          ✓ Rider Assigned
        </span>
      );
    }

    if (order.status === "OUT_FOR_DELIVERY") {
      return (
        <span className="text-xs font-semibold text-purple-600">
          🚚 Out for Delivery
        </span>
      );
    }

    if (order.status === "DELIVERED") {
      return (
        <span className="text-xs font-semibold text-emerald-600">
          ✓ Completed
        </span>
      );
    }

    if (order.status === "CANCELLED") {
      return (
        <span className="text-xs font-semibold text-red-500">
          Cancelled
        </span>
      );
    }

    return null;
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Orders
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage orders, payments and delivery assignments.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-10">
          <div className="flex items-center justify-center">
            <div className="text-sm text-slate-500">
              Loading orders...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Orders
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage orders, payments and delivery assignments.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="
              mt-4
              px-4
              py-2
              rounded-lg
              bg-slate-900
              text-white
              text-sm
              font-medium
              hover:bg-slate-800
              transition
            "
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-gradient-to-br
                from-blue-600
                to-purple-600
                text-white
                flex
                items-center
                justify-center
                font-bold
                shadow-lg
                shadow-blue-500/20
              "
            >
              O
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Orders
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Manage orders, payments and delivery assignments.
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="
            px-4
            py-2.5
            rounded-xl
            border
            border-slate-200
            bg-white
            text-sm
            font-medium
            text-slate-700
            hover:bg-slate-50
            transition
          "
        >
          Refresh
        </button>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Total
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            {orders.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Pending
          </p>

          <p className="text-2xl font-bold text-amber-600 mt-2">
            {
              orders.filter(
                (order) =>
                  order.status === "PENDING"
              ).length
            }
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            In Delivery
          </p>

          <p className="text-2xl font-bold text-purple-600 mt-2">
            {
              orders.filter(
                (order) =>
                  order.status ===
                  "OUT_FOR_DELIVERY"
              ).length
            }
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Delivered
          </p>

          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {
              orders.filter(
                (order) =>
                  order.status ===
                  "DELIVERED"
              ).length
            }
          </p>
        </div>

      </div>

      {/* ORDERS TABLE */}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                All Orders
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Review order status and manage delivery.
              </p>
            </div>

            <span
              className="
                px-3
                py-1.5
                rounded-full
                bg-blue-50
                text-blue-700
                text-xs
                font-semibold
              "
            >
              {orders.length} orders
            </span>

          </div>

        </div>

        {orders.length === 0 ? (

          <div className="p-12 text-center">

            <div className="text-4xl mb-3">
              📦
            </div>

            <h3 className="font-semibold text-slate-800">
              No orders found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Orders will appear here once customers place them.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-slate-50 border-b border-slate-200">

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Order
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Rider
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr
                    key={order.id}
                    className="
                      border-b
                      border-slate-100
                      last:border-0
                      hover:bg-slate-50/70
                      transition
                    "
                  >

                    {/* ORDER */}

                    <td className="px-6 py-5">

                      <p className="font-semibold text-slate-900">
                        #{order.order_number}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        ID: {order.id}
                      </p>

                    </td>

                    {/* CUSTOMER */}

                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-800">
                        {order.user?.name ||
                          order.customer_name ||
                          "Customer"}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {order.user?.email ||
                          order.customer_email ||
                          "—"}
                      </p>

                    </td>

                    {/* AMOUNT */}

                    <td className="px-6 py-5">

                      <p className="font-semibold text-slate-900">
                        ${order.total_price ?? "0"}
                      </p>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span
                        className={`
                          inline-flex
                          items-center
                          px-3
                          py-1.5
                          rounded-full
                          border
                          text-xs
                          font-semibold
                          ${getStatusStyle(
                            order.status
                          )}
                        `}
                      >
                        {getStatusLabel(
                          order.status
                        )}
                      </span>

                    </td>

                    {/* RIDER */}

                    <td className="px-6 py-5">

                      {order.rider ? (

                        <div>

                          <p className="font-medium text-slate-800">
                            {order.rider.user?.name ||
                              order.rider.rider_name ||
                              "Assigned"}
                          </p>

                          <p className="text-xs text-emerald-600 mt-1">
                            ✓ Assigned
                          </p>

                        </div>

                      ) : (

                        <span className="text-sm text-slate-400">
                          Not assigned
                        </span>

                      )}

                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5">

                      <div className="flex flex-wrap items-center gap-2">

                        <button
                          onClick={() =>
                            openDetailsDrawer(order)
                          }
                          className="
                            px-3
                            py-2
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            text-slate-700
                            text-xs
                            font-semibold
                            hover:bg-slate-50
                            transition
                          "
                        >
                          View Details
                        </button>

                        {renderLifecycleActions(
                          order
                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ========================================================
          ORDER DETAILS DRAWER
      ======================================================== */}

      {detailsOrder && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-slate-950/50
            backdrop-blur-sm
            flex
            justify-end
          "
          onClick={closeDetailsDrawer}
        >

          <div
            className="
              h-full
              w-full
              max-w-2xl
              bg-white
              shadow-2xl
              overflow-y-auto
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* DRAWER HEADER */}

            <div
              className="
                sticky
                top-0
                z-10
                bg-white
                border-b
                border-slate-200
                px-6
                py-5
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Order Details
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  #{detailsOrder.order_number}
                </h2>

              </div>

              <button
                onClick={closeDetailsDrawer}
                disabled={actionLoading}
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-slate-100
                  text-slate-600
                  hover:bg-slate-200
                  transition
                  text-xl
                  disabled:opacity-50
                "
              >
                ×
              </button>

            </div>

            <div className="p-6 space-y-6">

              {/* STATUS + ACTIONS */}

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Order Status
                    </p>

                    <span
                      className={`
                        inline-flex
                        mt-2
                        px-3
                        py-1.5
                        rounded-full
                        border
                        text-xs
                        font-semibold
                        ${getStatusStyle(
                          detailsOrder.status
                        )}
                      `}
                    >
                      {getStatusLabel(
                        detailsOrder.status
                      )}
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {detailsOrder.status ===
                      "CONFIRMED" &&
                      !detailsOrder.rider && (

                        <button
                          onClick={() =>
                            openAssignModal(
                              detailsOrder
                            )
                          }
                          disabled={actionLoading}
                          className="
                            px-3
                            py-2
                            rounded-lg
                            bg-gradient-to-r
                            from-blue-600
                            to-purple-600
                            text-white
                            text-xs
                            font-semibold
                            disabled:opacity-50
                          "
                        >
                          Assign Rider
                        </button>
                      )}

                    {detailsOrder.status !==
                      "DELIVERED" &&
                      detailsOrder.status !==
                        "CANCELLED" && (

                        <button
                          onClick={() =>
                            handleCancelOrder(
                              detailsOrder
                            )
                          }
                          disabled={actionLoading}
                          className="
                            px-3
                            py-2
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            text-red-600
                            text-xs
                            font-semibold
                            hover:bg-red-100
                            disabled:opacity-50
                          "
                        >
                          Cancel Order
                        </button>
                      )}

                  </div>

                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">

                  <p className="text-xs text-slate-400">
                    Created
                  </p>

                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {detailsOrder.created_at
                      ? new Date(
                          detailsOrder.created_at
                        ).toLocaleString()
                      : "—"}
                  </p>

                </div>

              </div>

              {/* CUSTOMER */}

              <div className="border border-slate-200 rounded-2xl p-5">

                <h3 className="font-semibold text-slate-900 mb-4">
                  Customer
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-slate-400">
                      Name
                    </p>

                    <p className="text-sm font-medium text-slate-800 mt-1">
                      {detailsOrder.user?.name ||
                        detailsOrder.customer_name ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Email
                    </p>

                    <p className="text-sm font-medium text-slate-800 mt-1 break-all">
                      {detailsOrder.user?.email ||
                        detailsOrder.customer_email ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Phone
                    </p>

                    <p className="text-sm font-medium text-slate-800 mt-1">
                      {detailsOrder.user?.phone_number ||
                        detailsOrder.customer_phone ||
                        "—"}
                    </p>
                  </div>

                </div>

              </div>

              {/* DELIVERY ADDRESS */}

              <div className="border border-slate-200 rounded-2xl p-5">

                <h3 className="font-semibold text-slate-900 mb-4">
                  Delivery Address
                </h3>

                <div className="space-y-2 text-sm">

                  <p className="text-slate-700">
                    {detailsOrder.delivery_address ||
                      "Address information unavailable"}
                  </p>

                  <p className="text-slate-500">
                    {[
                      detailsOrder.delivery_city,
                      detailsOrder.delivery_state,
                      detailsOrder.delivery_postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>

                  <p className="text-slate-500">
                    {detailsOrder.delivery_country ||
                      "—"}
                  </p>

                </div>

              </div>

              {/* ORDER ITEMS */}

              <div className="border border-slate-200 rounded-2xl overflow-hidden">

                <div className="px-5 py-4 border-b border-slate-200">

                  <h3 className="font-semibold text-slate-900">
                    Order Items
                  </h3>

                </div>

                {detailsOrder.items?.length ? (

                  <div>

                    {detailsOrder.items.map(
                      (item) => (

                        <div
                          key={item.id}
                          className="
                            px-5
                            py-4
                            border-b
                            border-slate-100
                            last:border-0
                            flex
                            items-center
                            justify-between
                            gap-4
                          "
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            {item.product_image ? (

                              <img
                                src={
                                  item.product_image
                                }
                                alt={
                                  item.product_name ||
                                  "Product"
                                }
                                className="
                                  w-12
                                  h-12
                                  rounded-lg
                                  object-cover
                                  border
                                  border-slate-200
                                "
                              />

                            ) : (

                              <div
                                className="
                                  w-12
                                  h-12
                                  rounded-lg
                                  bg-slate-100
                                  flex
                                  items-center
                                  justify-center
                                  text-lg
                                "
                              >
                                📦
                              </div>

                            )}

                            <div className="min-w-0">

                              <p className="font-medium text-slate-800 truncate">
                                {item.product_name ||
                                  "Product"}
                              </p>

                              <p className="text-xs text-slate-500 mt-1">
                                Qty: {item.quantity}
                              </p>

                              {item.price && (
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Unit price: $
                                  {item.price}
                                </p>
                              )}

                            </div>

                          </div>

                          <p className="font-semibold text-slate-900 whitespace-nowrap">
                            $
                            {item.subtotal ??
                              (
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 0
                                )
                              ).toFixed(2)}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <div className="p-5 text-sm text-slate-500">
                    No item details available.
                  </div>

                )}

              </div>

              {/* ORDER SUMMARY */}

              <div className="border border-slate-200 rounded-2xl p-5">

                <h3 className="font-semibold text-slate-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Subtotal
                    </span>

                    <span className="font-medium text-slate-800">
                      ${detailsOrder.subtotal ?? "0"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Delivery Fee
                    </span>

                    <span className="font-medium text-slate-800">
                      $
                      {detailsOrder.delivery_fee ??
                        "0"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Discount
                    </span>

                    <span className="font-medium text-emerald-600">
                      -$
                      {detailsOrder.discount ??
                        "0"}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between">

                    <span className="font-semibold text-slate-900">
                      Total
                    </span>

                    <span className="text-lg font-bold text-slate-900">
                      $
                      {detailsOrder.total_price ??
                        "0"}
                    </span>

                  </div>

                </div>

              </div>

              {/* PAYMENT */}

              <div className="border border-slate-200 rounded-2xl p-5">

                <div className="flex items-center justify-between mb-4">

                  <h3 className="font-semibold text-slate-900">
                    Payment
                  </h3>

                  {detailsOrder.payment?.payment_status && (

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        border
                        text-xs
                        font-semibold
                        ${getPaymentStatusStyle(
                          detailsOrder.payment
                            .payment_status
                        )}
                      `}
                    >
                      {
                        detailsOrder.payment
                          .payment_status
                      }
                    </span>

                  )}

                </div>

                {detailsOrder.payment ? (

                  <div className="grid sm:grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs text-slate-400">
                        Method
                      </p>

                      <p className="text-sm font-medium text-slate-800 mt-1">
                        {detailsOrder.payment
                          .payment_method ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Amount
                      </p>

                      <p className="text-sm font-medium text-slate-800 mt-1">
                        $
                        {detailsOrder.payment
                          .amount ??
                          detailsOrder.total_price ??
                          "0"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Currency
                      </p>

                      <p className="text-sm font-medium text-slate-800 mt-1">
                        {detailsOrder.payment
                          .currency ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Transaction
                      </p>

                      <p className="text-sm font-medium text-slate-800 mt-1 break-all">
                        {detailsOrder.payment
                          .transaction_id ||
                          "—"}
                      </p>
                    </div>

                  </div>

                ) : (

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-500">
                      Payment details are not included in the current order response.
                    </p>
                  </div>

                )}

              </div>

              {/* WAREHOUSE */}

              <div className="border border-slate-200 rounded-2xl p-5">

                <h3 className="font-semibold text-slate-900 mb-4">
                  Warehouse
                </h3>

                {detailsOrder.Warehouse ? (

                  <div className="grid sm:grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs text-slate-400">
                        Warehouse
                      </p>

                      <p className="text-sm font-medium text-slate-800 mt-1">
                        {detailsOrder.Warehouse.name ||
                          "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        City
                      </p>

                      <p className="text-sm font-medium text-slate-800 mt-1">
                        {detailsOrder.Warehouse.city ||
                          "—"}
                      </p>
                    </div>

                  </div>

                ) : (

                  <p className="text-sm font-medium text-slate-800">
                    {detailsOrder.warehouse_name ||
                      "Warehouse information unavailable"}
                  </p>

                )}

              </div>

              {/* RIDER */}

              <div className="border border-slate-200 rounded-2xl p-5">

                <div className="flex items-center justify-between mb-4">

                  <h3 className="font-semibold text-slate-900">
                    Rider
                  </h3>

                  {detailsOrder.rider && (
                    <span className="text-xs font-semibold text-emerald-600">
                      Assigned
                    </span>
                  )}

                </div>

                {detailsOrder.rider ? (

                  <div className="flex items-center gap-4">

                    <div
                      className="
                        w-12
                        h-12
                        rounded-full
                        bg-gradient-to-br
                        from-blue-600
                        to-purple-600
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                        shadow-md
                      "
                    >
                      {(
                        detailsOrder.rider.user?.name ||
                        detailsOrder.rider.rider_name ||
                        "R"
                      )[0].toUpperCase()}
                    </div>

                    <div>

                      <p className="font-semibold text-slate-800">
                        {detailsOrder.rider.user?.name ||
                          detailsOrder.rider.rider_name ||
                          "Assigned Rider"}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {detailsOrder.rider.user?.email ||
                          detailsOrder.rider.rider_email ||
                          "—"}
                      </p>

                      {(detailsOrder.rider.vehicle_type ||
                        detailsOrder.rider.rider_vehicle) && (

                        <p className="text-xs text-slate-400 mt-1">
                          Vehicle:{" "}
                          {detailsOrder.rider.vehicle_type ||
                            detailsOrder.rider.rider_vehicle}
                        </p>

                      )}

                    </div>

                  </div>

                ) : (

                  <div className="bg-slate-50 rounded-xl p-4">

                    <p className="text-sm text-slate-500">
                      No rider assigned to this order.
                    </p>

                  </div>

                )}

              </div>

              {/* DELIVERY */}

              <div className="border border-slate-200 rounded-2xl p-5">

                <h3 className="font-semibold text-slate-900 mb-4">
                  Delivery
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-slate-400">
                      Delivery Status
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {getStatusLabel(
                        detailsOrder.status
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Rider
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {detailsOrder.rider
                        ? "Assigned"
                        : "Not assigned"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Latitude
                    </p>

                    <p className="text-sm font-medium text-slate-800 mt-1">
                      {detailsOrder.delivery_latitude ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Longitude
                    </p>

                    <p className="text-sm font-medium text-slate-800 mt-1">
                      {detailsOrder.delivery_longitude ||
                        "—"}
                    </p>
                  </div>

                </div>

              </div>

              {/* CLOSE */}

              <button
                onClick={closeDetailsDrawer}
                disabled={actionLoading}
                className="
                  w-full
                  py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  text-white
                  text-sm
                  font-semibold
                  shadow-lg
                  shadow-blue-500/20
                  hover:opacity-90
                  transition
                  disabled:opacity-50
                "
              >
                Close Details
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ========================================================
          ASSIGN RIDER MODAL
      ======================================================== */}

      {selectedOrder && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-slate-950/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
          onClick={closeAssignModal}
        >

          <div
            className="
              w-full
              max-w-lg
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div
              className="
                px-6
                py-5
                border-b
                border-slate-200
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  Assign Rider
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Order #{selectedOrder.order_number}
                </p>

              </div>

              <button
                onClick={closeAssignModal}
                disabled={assigning}
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-slate-100
                  text-slate-500
                  hover:bg-slate-200
                  transition
                  disabled:opacity-50
                "
              >
                ×
              </button>

            </div>

            {/* BODY */}

            <div className="p-6">

              <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-100">

                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Delivery
                </p>

                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {selectedOrder.order_number}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Customer:{" "}
                  {selectedOrder.user?.name ||
                    selectedOrder.customer_name ||
                    "Customer"}
                </p>

              </div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Available Rider
              </label>

              {ridersLoading ? (

                <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
                  Loading available riders...
                </div>

              ) : riders.length === 0 ? (

                <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">

                  <p className="text-sm font-semibold text-amber-800">
                    No riders available
                  </p>

                  <p className="text-xs text-amber-700 mt-1">
                    There is currently no available rider for assignment.
                  </p>

                </div>

              ) : (

                <select
                  value={selectedRider}
                  onChange={(e) =>
                    setSelectedRider(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    text-slate-800
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500/20
                    focus:border-blue-500
                  "
                >

                  <option value="">
                    Select a rider
                  </option>

                  {riders.map((rider) => (

                    <option
                      key={rider.id}
                      value={rider.id}
                    >
                      {rider.rider_name ||
                        rider.user?.name ||
                        rider.rider_email ||
                        rider.user?.email ||
                        `Rider ${rider.id}`}
                      {" — "}
                      {rider.vehicle_type ||
                        "Vehicle"}
                    </option>

                  ))}

                </select>

              )}

            </div>

            {/* FOOTER */}

            <div
              className="
                px-6
                py-4
                bg-slate-50
                border-t
                border-slate-200
                flex
                justify-end
                gap-3
              "
            >

              <button
                onClick={closeAssignModal}
                disabled={assigning}
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  text-sm
                  font-medium
                  text-slate-700
                  hover:bg-slate-100
                  transition
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleAssignRider}
                disabled={
                  assigning ||
                  !selectedRider ||
                  riders.length === 0
                }
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  text-white
                  text-sm
                  font-semibold
                  shadow-md
                  shadow-blue-500/20
                  hover:opacity-90
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {assigning
                  ? "Assigning..."
                  : "Assign Rider"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminOrders;