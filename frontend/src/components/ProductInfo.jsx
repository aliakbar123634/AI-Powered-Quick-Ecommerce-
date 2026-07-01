import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";
import { useState } from "react";

const ProductInfo = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-6">

      {/* Category */}
      <span className="text-blue-600 font-semibold uppercase tracking-wide text-sm">
        {product.category_name}
      </span>

      {/* Product Name */}
      <h1 className="text-4xl font-bold text-slate-900 leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">

        <div className="flex items-center gap-1">
          <Star
            size={20}
            fill="#FACC15"
            stroke="#FACC15"
          />
          <span className="font-semibold">
            {product.average_rating || 0}
          </span>
        </div>

        <span className="text-slate-500">
          ({product.reviews_count} Reviews)
        </span>

      </div>

      {/* Price */}

      <div className="flex items-center gap-4">

        <span className="text-4xl font-bold text-slate-900">
          ${product.discount_price}
        </span>

        <span className="line-through text-xl text-slate-400">
          ${product.price}
        </span>

        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
          {product.off}% OFF
        </span>

      </div>

      {/* Brand */}

      <div className="flex gap-2 text-lg">

        <span className="font-semibold">
          Brand:
        </span>

        <span className="text-slate-600">
          {product.brand}
        </span>

      </div>

      {/* Stock */}

      <div className="flex items-center gap-2">

        <span
          className={`w-3 h-3 rounded-full ${
            product.stock_status
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />

        <span
          className={`font-semibold ${
            product.stock_status
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {product.stock_status
            ? "In Stock"
            : "Out Of Stock"}
        </span>

      </div>

      {/* Description */}

      <p className="text-slate-600 leading-8">
        {product.description}
      </p>

      {/* Quantity */}

      <div className="flex items-center gap-6">

        <span className="font-semibold">
          Quantity
        </span>

        <div className="flex items-center border rounded-xl overflow-hidden">

          <button
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-100"
            onClick={() =>
              qty > 1 && setQty(qty - 1)
            }
          >
            <Minus size={18} />
          </button>

          <span className="w-14 text-center font-semibold">
            {qty}
          </span>

          <button
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-100"
            onClick={() =>
              setQty(qty + 1)
            }
          >
            <Plus size={18} />
          </button>

        </div>

      </div>

      {/* Buttons */}

      <div className="flex gap-4">

        <button
          onClick={() => onAddToCart(qty)}
          className="
          flex-1
          bg-blue-600
          hover:bg-blue-700
          text-white
          h-14
          rounded-xl
          font-semibold
          "
        >
          Add To Cart
        </button>

        <button
          className="
          flex-1
          bg-green-600
          hover:bg-green-700
          text-white
          h-14
          rounded-xl
          font-semibold
          "
        >
          Buy Now
        </button>

      </div>

      {/* Features */}

      <div className="border-t pt-6 space-y-4">

        <div className="flex items-center gap-3">
          <Truck className="text-blue-600" />
          <span>Free Shipping</span>
        </div>

        <div className="flex items-center gap-3">
          <RotateCcw className="text-blue-600" />
          <span>30 Days Return Policy</span>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600" />
          <span>100% Secure Payment</span>
        </div>

      </div>

    </div>
  );
};

export default ProductInfo;