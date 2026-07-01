import React from "react";
import { Link } from "react-router-dom";
import { PackageX } from "lucide-react";

const EmptyOrders = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 px-8 text-center">

      <div className="flex justify-center mb-6">
        <PackageX
          size={80}
          className="text-gray-400"
        />
      </div>

      <h2 className="text-3xl font-bold text-slate-900">
        No Orders Yet
      </h2>

      <p className="text-gray-500 mt-4 max-w-md mx-auto">
        You haven't placed any orders yet.
        Start shopping to place your first order.
      </p>

      <Link
        to="/products"
        className="
          inline-block
          mt-8
          bg-green-600
          hover:bg-green-700
          text-white
          px-8
          py-3
          rounded-2xl
          font-semibold
          transition
        "
      >
        Continue Shopping
      </Link>

    </div>
  );
};

export default EmptyOrders;