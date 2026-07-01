import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const OrdersBreadcrumb = () => {
  return (
    <section className="bg-gray-100 border-b">
      <div className="max-w-7xl mx-auto px-6 py-5">

        <div className="flex items-center gap-2 text-sm">

          <Link
            to="/"
            className="text-gray-500 hover:text-green-600 transition"
          >
            Home
          </Link>

          <ChevronRight
            size={16}
            className="text-gray-400"
          />

          <span className="font-semibold text-gray-900">
            My Orders
          </span>

        </div>

      </div>
    </section>
  );
};

export default OrdersBreadcrumb;