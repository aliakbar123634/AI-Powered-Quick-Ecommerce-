import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
} from "lucide-react";

const CartActions = ({ onClearCart }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-10">

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-200
          shadow-sm
          p-6
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-4
        "
      >

        {/* Continue Shopping */}

        <Link
          to="/products"
          className="
            w-full
            sm:w-auto
            flex
            items-center
            justify-center
            gap-2
            px-6
            py-3
            rounded-xl
            border
            border-green-600
            text-green-600
            font-semibold
            hover:bg-green-600
            hover:text-white
            transition-all
          "
        >
          <ShoppingBag size={20} />
          Continue Shopping
        </Link>

        {/* Clear Cart */}

        <button
          onClick={onClearCart}
          className="
            w-full
            sm:w-auto
            flex
            items-center
            justify-center
            gap-2
            px-6
            py-3
            rounded-xl
            bg-red-500
            hover:bg-red-600
            text-white
            font-semibold
            transition-all
          "
        >
          <Trash2 size={20} />
          Clear Cart
        </button>

      </div>

    </div>
  );
};

export default CartActions;