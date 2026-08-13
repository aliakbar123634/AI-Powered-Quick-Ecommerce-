import React from "react";
import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold text-red-600">
        Payment Failed ❌
      </h1>

      <p className="mt-4 text-gray-600">
        Something went wrong with your payment.
      </p>

      <p className="mt-2 text-gray-500">
        Please try again or choose another payment method.
      </p>


      <div className="flex gap-4 mt-6">

        <Link
          to="/payment"
          className="
            bg-red-600
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Try Again
        </Link>


        <Link
          to="/orders"
          className="
            bg-slate-900
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          View Orders
        </Link>

      </div>

    </div>
  );
};

export default PaymentFailed;

