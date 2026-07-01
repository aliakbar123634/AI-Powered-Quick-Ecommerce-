import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, ShoppingCart } from "lucide-react";

const CartBreadcrumb = () => {
  return (
    <section className="bg-slate-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-5">

        <div className="flex items-center gap-2 text-sm text-slate-600">

          <Link
            to="/"
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <Home size={16} />
            Home
          </Link>

          <ChevronRight size={16} />

          <span className="flex items-center gap-1 font-semibold text-slate-900">
            <ShoppingCart size={16} />
            Cart
          </span>

        </div>

      </div>
    </section>
  );
};

export default CartBreadcrumb;