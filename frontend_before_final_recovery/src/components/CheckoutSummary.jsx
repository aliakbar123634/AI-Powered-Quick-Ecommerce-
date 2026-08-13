import React from "react";

const CheckoutSummary = ({
  cart,
  onPlaceOrder,


}) => {

  const shipping = 0;
  const tax = 0;

  const subtotal = Number(cart.total_price);

  const total =
    subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sticky top-24">

      <h2 className="text-2xl font-bold mb-8">
        Order Summary
      </h2>

      {/* Subtotal */}

      <div className="flex justify-between mb-4">

        <span className="text-gray-600">
          Subtotal
        </span>

        <span className="font-semibold">
          ${subtotal.toFixed(2)}
        </span>

      </div>

      {/* Shipping */}

      <div className="flex justify-between mb-4">

        <span className="text-gray-600">
          Shipping
        </span>

        <span className="font-semibold text-green-600">
          Free
        </span>

      </div>

      {/* Tax */}

      <div className="flex justify-between mb-6">

        <span className="text-gray-600">
          Tax
        </span>

        <span className="font-semibold">
          ${tax.toFixed(2)}
        </span>

      </div>

      <hr />

      {/* Total */}

      <div className="flex justify-between mt-6 mb-8">

        <span className="text-xl font-bold">
          Total
        </span>

        <span className="text-2xl font-bold text-green-600">
          ${total.toFixed(2)}
        </span>

      </div>

      {/* Button */}

      <button
        onClick={onPlaceOrder}
        className="
          w-full
          bg-green-600
          hover:bg-green-700
          text-white
          py-4
          rounded-2xl
          font-semibold
          text-lg
          transition
        "
      >
        Place Order
      </button>

    </div>
  );
};

export default CheckoutSummary;