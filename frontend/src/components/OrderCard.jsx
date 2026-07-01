import React from "react";
import { Link } from "react-router-dom";
import { Package, CalendarDays, Eye } from "lucide-react";

const OrderCard = ({ order }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "PROCESSING":
        return "bg-blue-100 text-blue-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div
      className="
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        p-6
      "
    >
      {/* Top */}

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Order #{order.order_number}
          </h2>

          <div className="flex items-center gap-2 mt-2 text-gray-500">

            <CalendarDays size={18} />

            <span>
              {new Date(order.created_at).toLocaleDateString()}
            </span>

          </div>

        </div>

        <span
          className={`
            px-4
            py-2
            rounded-full
            text-sm
            font-semibold
            ${getStatusColor(order.status)}
          `}
        >
          {order.status}
        </span>

      </div>

      {/* Middle */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">

        <div>

          <p className="text-gray-500">
            Total Items
          </p>

          <h3 className="text-xl font-bold">
            {order.total_items}
          </h3>

        </div>

        <div>

          <p className="text-gray-500">
            Total Price
          </p>

          <h3 className="text-xl font-bold text-green-600">
            ${order.total_price}
          </h3>

        </div>

        <div>

          <p className="text-gray-500">
            Status
          </p>

          <h3 className="text-xl font-bold">
            {order.status}
          </h3>

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-8 flex justify-end">

        <Link
          to={`/orders/${order.id}`}
          className="
            flex
            items-center
            gap-2
            bg-slate-900
            hover:bg-slate-800
            text-white
            px-6
            py-3
            rounded-xl
            transition
          "
        >
          <Eye size={18} />

          View Details
        </Link>

      </div>

    </div>
  );
};

export default OrderCard;