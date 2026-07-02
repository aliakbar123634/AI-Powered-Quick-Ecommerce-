import React from "react";
import { Link } from "react-router-dom";

const EmptyWishlist = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-12 text-center">

        {/* Icon */}

        <div className="text-7xl mb-6">
          ❤️
        </div>

        {/* Heading */}

        <h2 className="text-4xl font-bold text-slate-900">
          Your Wishlist is Empty
        </h2>

        {/* Description */}

        <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
          Looks like you haven't added any products yet.
          Browse our collection and save your favourite items here.
        </p>

        {/* Button */}

        <Link
          to="/products"
          className="
            inline-block
            mt-10
            bg-green-600
            hover:bg-green-700
            text-white
            px-10
            py-4
            rounded-2xl
            font-semibold
            transition
          "
        >
          Continue Shopping
        </Link>

      </div>

    </div>
  );
};

export default EmptyWishlist;