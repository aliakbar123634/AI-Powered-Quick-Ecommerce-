import React from "react";
import { useNavigate } from "react-router-dom";

const OrderActions = ({
  order,
  onCancelOrder,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 mt-8">

      <h2 className="text-2xl font-bold mb-8">
        Order Actions
      </h2>

      {/* Cancel Button */}

      {order.status !== "CANCELLED" &&
        order.status !== "DELIVERED" && (
          <button
            onClick={() => onCancelOrder(order.id)}
            className="
              w-full
              bg-red-600
              hover:bg-red-700
              text-white
              py-4
              rounded-2xl
              font-semibold
              transition
              mb-4
            "
          >
            Cancel Order
          </button>
        )}

      {/* View Orders */}

      <button
        onClick={() => navigate("/orders")}
        className="
          w-full
          bg-slate-900
          hover:bg-slate-800
          text-white
          py-4
          rounded-2xl
          font-semibold
          transition
          mb-4
        "
      >
        View All Orders
      </button>

      {/* Continue Shopping */}

      <button
        onClick={() => navigate("/products")}
        className="
          w-full
          border
          border-slate-900
          text-slate-900
          hover:bg-slate-900
          hover:text-white
          py-4
          rounded-2xl
          font-semibold
          transition
        "
      >
        Continue Shopping
      </button>

    </div>
  );
};

export default OrderActions;