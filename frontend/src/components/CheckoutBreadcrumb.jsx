import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const CheckoutBreadcrumb = () => {
  return (
    <div className="bg-gray-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-5">

        <div className="flex items-center gap-2 text-sm">

          <Link
            to="/"
            className="text-gray-500 hover:text-green-600"
          >
            Home
          </Link>

          <ChevronRight size={16} />

          <Link
            to="/cart"
            className="text-gray-500 hover:text-green-600"
          >
            Cart
          </Link>

          <ChevronRight size={16} />

          <span className="font-semibold text-slate-900">
            Checkout
          </span>

        </div>

      </div>
    </div>
  );
};

export default CheckoutBreadcrumb;