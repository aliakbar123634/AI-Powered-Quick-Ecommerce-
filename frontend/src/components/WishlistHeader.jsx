import React from "react";

const WishlistHeader = ({ totalItems }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">
            My Wishlist ❤️
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Save your favourite products and purchase them anytime.
          </p>

        </div>

        <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-semibold">

          {totalItems} {totalItems === 1 ? "Product" : "Products"}

        </div>

      </div>

    </div>
  );
};

export default WishlistHeader;