import React, { useEffect, useState } from "react";

import {
  getAdminOrders,
  getAdminRiders,
  getAvailableRiders,
  getAdminWarehouses,
  getAdminInventory,
  getLowStock,
} from "../../api/adminApi";


const AdminStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,

    totalRiders: 0,
    availableRiders: 0,

    totalWarehouses: 0,
    activeWarehouses: 0,

    totalInventory: 0,
    lowStock: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");


  // =========================================================
  // Extract array from Django REST Framework response
  // =========================================================

  const extractArray = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    return [];
  };


  // =========================================================
  // Fetch dashboard data
  // =========================================================

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");


      const results = await Promise.allSettled([
        getAdminOrders(),
        getAdminRiders(),
        getAvailableRiders(),
        getAdminWarehouses(),
        getAdminInventory(),
        getLowStock(),
      ]);


      // -------------------------------------------------------
      // Extract responses
      // -------------------------------------------------------

      const orders =
        results[0].status === "fulfilled"
          ? extractArray(results[0].value)
          : [];


      const riders =
        results[1].status === "fulfilled"
          ? extractArray(results[1].value)
          : [];


      const availableRiders =
        results[2].status === "fulfilled"
          ? extractArray(results[2].value)
          : [];


      const warehouses =
        results[3].status === "fulfilled"
          ? extractArray(results[3].value)
          : [];


      const inventory =
        results[4].status === "fulfilled"
          ? extractArray(results[4].value)
          : [];


      const lowStock =
        results[5].status === "fulfilled"
          ? extractArray(results[5].value)
          : [];


      // =====================================================
      // Order statistics
      // =====================================================

      const pendingOrders = orders.filter(
        (order) =>
          String(order?.status || "").toUpperCase() === "PENDING"
      ).length;


      const confirmedOrders = orders.filter(
        (order) =>
          String(order?.status || "").toUpperCase() === "CONFIRMED"
      ).length;


      const deliveredOrders = orders.filter(
        (order) =>
          String(order?.status || "").toUpperCase() === "DELIVERED"
      ).length;


      // =====================================================
      // Warehouse statistics
      // =====================================================

      const activeWarehouses = warehouses.filter(
        (warehouse) => warehouse?.is_active === true
      ).length;


      // =====================================================
      // Recent orders
      // =====================================================

      const latestOrders = [...orders]
        .sort((a, b) => {
          const dateA = new Date(
            a?.created_at || 0
          ).getTime();

          const dateB = new Date(
            b?.created_at || 0
          ).getTime();

          return dateB - dateA;
        })
        .slice(0, 5);


      // =====================================================
      // Update state
      // =====================================================

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,

        totalRiders: riders.length,
        availableRiders: availableRiders.length,

        totalWarehouses: warehouses.length,
        activeWarehouses,

        totalInventory: inventory.length,
        lowStock: lowStock.length,
      });


      setRecentOrders(latestOrders);


      // =====================================================
      // Check failed requests
      // =====================================================

      const failedRequests = results.filter(
        (result) => result.status === "rejected"
      );


      if (failedRequests.length > 0) {
        console.warn(
          "Some admin dashboard requests failed:",
          failedRequests
        );
      }


      // If everything failed
      if (
        failedRequests.length === results.length
      ) {
        setError(
          "Unable to load admin dashboard data. Please check your permissions."
        );
      }

    } catch (err) {
      console.error(
        "Admin dashboard error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to load dashboard data."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // =========================================================
  // Initial load
  // =========================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);


  // =========================================================
  // Status badge
  // =========================================================

  const getStatusClass = (status) => {
    const normalizedStatus =
      String(status || "").toUpperCase();


    switch (normalizedStatus) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "OUT_FOR_DELIVERY":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";

      case "FAILED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };


  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-7">

        <div>
          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />

          <div className="h-9 w-56 bg-slate-200 rounded-lg mt-3 animate-pulse" />

          <div className="h-4 w-80 bg-slate-200 rounded mt-3 animate-pulse" />
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />

              <div className="h-9 w-20 bg-slate-200 rounded mt-4 animate-pulse" />
            </div>
          ))}

        </div>

      </div>
    );
  }


  // =========================================================
  // Main stats cards
  // =========================================================

  const statCards = [

    {
      title: "Total Orders",
      value: stats.totalOrders,
      subtitle: "All customer orders",
      icon: "◫",
      iconClass: "bg-blue-50 text-blue-600",
    },

    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      subtitle: "Waiting for action",
      icon: "◷",
      iconClass: "bg-amber-50 text-amber-600",
    },

    {
      title: "Available Riders",
      value: stats.availableRiders,
      subtitle: `${stats.totalRiders} total riders`,
      icon: "♟",
      iconClass: "bg-purple-50 text-purple-600",
    },

    {
      title: "Warehouses",
      value: stats.totalWarehouses,
      subtitle: `${stats.activeWarehouses} active`,
      icon: "⌂",
      iconClass: "bg-emerald-50 text-emerald-600",
    },

  ];


  return (
    <div className="space-y-7">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Overview
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            QuickAI administration overview.
          </p>

        </div>


        <button
          type="button"
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="
            self-start
            md:self-auto
            inline-flex
            items-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            bg-white
            border
            border-slate-200
            text-sm
            font-semibold
            text-slate-700
            shadow-sm
            hover:border-blue-300
            hover:text-blue-600
            transition
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >

          <span className={refreshing ? "animate-spin" : ""}>
            ↻
          </span>

          {refreshing ? "Refreshing..." : "Refresh"}

        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="
          bg-red-50
          border
          border-red-200
          rounded-2xl
          px-5
          py-4
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
        ">

          <div>

            <p className="font-semibold text-red-700">
              Dashboard data could not be fully loaded
            </p>

            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>

          </div>


          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            className="
              px-4
              py-2
              rounded-lg
              bg-red-600
              text-white
              text-sm
              font-semibold
              hover:bg-red-700
              transition
            "
          >
            Retry
          </button>

        </div>
      )}


      {/* =====================================================
          PRIMARY STATS
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {statCards.map((stat) => (

          <div
            key={stat.title}
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              p-6
              shadow-sm
              hover:shadow-md
              hover:-translate-y-0.5
              transition
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-3">
                  {stat.value}
                </h2>

              </div>


              <div
                className={`
                  w-11
                  h-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  font-bold
                  text-lg
                  ${stat.iconClass}
                `}
              >
                {stat.icon}
              </div>

            </div>


            <p className="text-xs text-slate-400 mt-4">
              {stat.subtitle}
            </p>

          </div>

        ))}

      </div>


      {/* =====================================================
          SECONDARY STATS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


        {/* Delivered Orders */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Delivered Orders
              </p>

              <h3 className="text-2xl font-bold text-emerald-600 mt-2">
                {stats.deliveredOrders}
              </h3>

            </div>

            <div className="
              w-11
              h-11
              rounded-xl
              bg-emerald-50
              text-emerald-600
              flex
              items-center
              justify-center
              font-bold
            ">
              ✓
            </div>

          </div>

        </div>


        {/* Confirmed Orders */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Confirmed Orders
              </p>

              <h3 className="text-2xl font-bold text-blue-600 mt-2">
                {stats.confirmedOrders}
              </h3>

            </div>

            <div className="
              w-11
              h-11
              rounded-xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              font-bold
            ">
              ✓
            </div>

          </div>

        </div>


        {/* Low Stock */}

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Low Stock
              </p>

              <h3
                className={`
                  text-2xl
                  font-bold
                  mt-2
                  ${
                    stats.lowStock > 0
                      ? "text-red-600"
                      : "text-emerald-600"
                  }
                `}
              >
                {stats.lowStock}
              </h3>

            </div>


            <div
              className={`
                w-11
                h-11
                rounded-xl
                flex
                items-center
                justify-center
                font-bold
                ${
                  stats.lowStock > 0
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }
              `}
            >
              !
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <div className="
        bg-white
        border
        border-slate-200
        rounded-2xl
        shadow-sm
        overflow-hidden
      ">


        <div className="
          px-6
          py-5
          border-b
          border-slate-200
          flex
          items-center
          justify-between
          gap-4
        ">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Recent Orders
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest customer orders.
            </p>

          </div>


          <span className="
            px-3
            py-1.5
            rounded-full
            bg-blue-50
            text-blue-600
            text-xs
            font-semibold
            whitespace-nowrap
          ">
            {stats.totalOrders} total
          </span>

        </div>


        {recentOrders.length === 0 ? (

          <div className="py-14 text-center">

            <div className="
              mx-auto
              w-12
              h-12
              rounded-xl
              bg-slate-100
              text-slate-400
              flex
              items-center
              justify-center
              text-lg
            ">
              ◫
            </div>

            <p className="mt-4 font-semibold text-slate-700">
              No orders yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              New orders will appear here.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px]">

              <thead className="bg-slate-50">

                <tr>

                  <th className="
                    px-6 py-4
                    text-left
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  ">
                    Order
                  </th>

                  <th className="
                    px-6 py-4
                    text-left
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  ">
                    Customer
                  </th>

                  <th className="
                    px-6 py-4
                    text-left
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  ">
                    Total
                  </th>

                  <th className="
                    px-6 py-4
                    text-left
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  ">
                    Status
                  </th>

                  <th className="
                    px-6 py-4
                    text-left
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-500
                  ">
                    Date
                  </th>

                </tr>

              </thead>


              <tbody>

                {recentOrders.map((order) => {

                  const customerName =
                    order?.user?.name ||
                    order?.customer_name ||
                    "Customer";


                  const customerEmail =
                    order?.user?.email ||
                    order?.customer_email ||
                    "—";


                  const orderNumber =
                    order?.order_number ||
                    order?.id ||
                    "—";


                  const total =
                    order?.total_price ??
                    order?.total ??
                    "0";


                  return (

                    <tr
                      key={order?.id || orderNumber}
                      className="
                        border-t
                        border-slate-100
                        hover:bg-slate-50
                        transition
                      "
                    >

                      <td className="px-6 py-4">

                        <p className="font-semibold text-slate-900">
                          #{orderNumber}
                        </p>

                      </td>


                      <td className="px-6 py-4">

                        <p className="font-medium text-slate-800">
                          {customerName}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {customerEmail}
                        </p>

                      </td>


                      <td className="
                        px-6
                        py-4
                        font-semibold
                        text-slate-900
                      ">
                        ${total}
                      </td>


                      <td className="px-6 py-4">

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
                            ${getStatusClass(order?.status)}
                          `}
                        >
                          {order?.status || "UNKNOWN"}
                        </span>

                      </td>


                      <td className="
                        px-6
                        py-4
                        text-sm
                        text-slate-500
                      ">

                        {order?.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString()
                          : "—"}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <div className="
        bg-gradient-to-r
        from-blue-600
        to-purple-600
        rounded-2xl
        p-6
        md:p-7
        text-white
        shadow-lg
        shadow-blue-500/20
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-5
        ">

          <div>

            <div className="flex items-center gap-2">

              <span className="
                w-2.5
                h-2.5
                rounded-full
                bg-emerald-300"
              />

              <span className="text-sm font-semibold">
                System Online
              </span>

            </div>


            <h3 className="text-xl font-bold mt-2">
              QuickAI Administration
            </h3>


            <p className="text-sm text-white/70 mt-1">
              Monitor orders, riders, warehouses and inventory.
            </p>

          </div>


          <div className="
            px-4
            py-2
            rounded-xl
            bg-white/10
            border
            border-white/10
            text-sm
            font-medium
          ">
            Live Dashboard
          </div>

        </div>

      </div>

    </div>
  );
};


export default AdminStats;