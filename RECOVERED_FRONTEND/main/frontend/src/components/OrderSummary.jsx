import React from "react";

const OrderSummary = ({ order }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">

      <h2 className="text-2xl font-bold mb-8">
        Order Summary
      </h2>

      {/* Subtotal */}

      <div className="flex justify-between items-center mb-4">

        <span className="text-gray-600">
          Subtotal
        </span>

        <span className="font-semibold">
          ${Number(order.subtotal).toFixed(2)}
        </span>

      </div>

      {/* Delivery Fee */}

      <div className="flex justify-between items-center mb-4">

        <span className="text-gray-600">
          Delivery Fee
        </span>

        <span className="font-semibold">
          ${Number(order.delivery_fee).toFixed(2)}
        </span>

      </div>

      {/* Discount */}

      <div className="flex justify-between items-center mb-6">

        <span className="text-gray-600">
          Discount
        </span>

        <span className="font-semibold text-green-600">
          -${Number(order.discount).toFixed(2)}
        </span>

      </div>

      <hr />

      {/* Grand Total */}

      <div className="flex justify-between items-center mt-6">

        <span className="text-xl font-bold">
          Grand Total
        </span>

        <span className="text-3xl font-bold text-green-600">
          ${Number(order.total_price).toFixed(2)}
        </span>

      </div>

    </div>
  );
};

export default OrderSummary;