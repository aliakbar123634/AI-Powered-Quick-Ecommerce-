import React from "react";
import { Link } from "react-router-dom";

const WishlistCard = ({ item, handleRemove }) => {

  const hasDiscount =
    item.product_discount_price &&
    Number(item.product_discount_price) < Number(item.product_price);

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden hover:shadow-lg transition">

      {/* Product Image */}

      <div className="relative">

        <img
          src={item.product_image}
          alt={item.product_name}
          className="w-full h-64 object-cover"
        />

        {hasDiscount && (

          <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Sale
          </span>

        )}

      </div>

      {/* Product Info */}

      <div className="p-6">

        <h2 className="text-xl font-bold text-slate-900 line-clamp-2">
          {item.product_name}
        </h2>

        {/* Price */}

        <div className="flex items-center gap-3 mt-4">

          {hasDiscount ? (
            <>
              <span className="text-2xl font-bold text-green-600">
                ${item.product_discount_price}
              </span>

              <span className="text-gray-400 line-through">
                ${item.product_price}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-slate-900">
              ${item.product_price}
            </span>
          )}

        </div>

        {/* Buttons */}

        <div className="grid grid-cols-2 gap-3 mt-8">

          <Link
            to={`/products/${item.product}`}
            className="
              text-center
              bg-green-600
              hover:bg-green-700
              text-white
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            View
          </Link>

          <button
            className="
              border
              border-red-500
              text-red-500
              hover:bg-red-500
              hover:text-white
              py-3
              rounded-xl
              font-semibold
              transition
            "
            onClick={() => handleRemove(item.product)}
          >
            Remove
          </button>

        </div>

      </div>

    </div>
  );
};

export default WishlistCard;