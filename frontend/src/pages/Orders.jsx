import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrdersBreadcrumb from "../components/OrdersBreadcrumb";
import OrdersHeader from "../components/OrdersHeader";
import OrdersList from "../components/OrdersList";
import { getOrders } from "../api/orderApi";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const response = await getOrders();

        console.log(response.data);

        setOrders(response.data.results);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
      <Navbar />

      <OrdersBreadcrumb />

      <OrdersHeader />

      <OrdersList orders={orders} />

    </>
  );
};

export default Orders;