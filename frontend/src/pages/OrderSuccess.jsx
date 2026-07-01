import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const OrderSuccess = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">

        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-2xl text-center">

          <CheckCircle
            size={90}
            className="text-green-600 mx-auto"
          />

          <h1 className="text-4xl font-bold mt-6">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-500 mt-4">
            Thank you for your purchase.
            Your order has been placed successfully.
          </p>

          <div className="mt-8">

            <h3 className="text-lg">
              Order Status
            </h3>

            <span className="inline-block mt-2 px-5 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
              Processing
            </span>

          </div>

          <div className="flex justify-center gap-4 mt-10">

            <Link
              to="/products"
              className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-black transition"
            >
              Continue Shopping
            </Link>

            <Link
              to="/orders"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              View Orders
            </Link>

          </div>

        </div>

      </div>

    </>
  );
};

export default OrderSuccess;