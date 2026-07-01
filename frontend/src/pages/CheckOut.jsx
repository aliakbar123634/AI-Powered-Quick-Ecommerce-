import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CheckoutBreadcrumb from "../components/CheckoutBreadcrumb";
import CheckoutAddress from "../components/CheckoutAddress";
import PaymentMethod from "../components/PaymentMethod";
import CheckoutSummary from "../components/CheckoutSummary";
import { allCart, createOrder } from "../api/orderApi";

const Checkout = () => {

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleCreateOrder = async () => {
  try {
    const response = await createOrder({address: 1});
    

    console.log(response.data);

    navigate("/order-success");
  } catch (error) {
        if (error.response) {
      alert(error.response.data.error);
    } else {
      alert("Something went wrong.");
    }

    console.log(error);
  }
};

  useEffect(() => {

    const fetchCart = async () => {
      try {
        const response = await allCart();
        setCart(response.data.results[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();

  }, []);

  if (loading) return <h2>Loading...</h2>;

  if (!cart) return <h2>No Cart Found</h2>;

  return (
    <>
      <Navbar />

      <CheckoutBreadcrumb />

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-12 gap-10">

          <div className="lg:col-span-8">

            <CheckoutAddress />

            <PaymentMethod />

          </div>

          <div className="lg:col-span-4">

            <CheckoutSummary cart={cart} onPlaceOrder={handleCreateOrder} />

          </div>

        </div>

      </div>

    </>
  );
};

export default Checkout;