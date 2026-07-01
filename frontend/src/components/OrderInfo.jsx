import React from "react";
import {
  Package,
  CalendarDays,
  MapPin,
  CreditCard,
} from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";

const OrderInfo = ({ order }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mb-8">

      {/* Top */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">

        <div>

          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">

            <Package size={30} />

            Order #{order.order_number}

          </h2>

          <p className="text-gray-500 mt-2">
            Thank you for your purchase.
          </p>

        </div>

        <OrderStatusBadge
          status={order.status}
        />

      </div>

      {/* Details */}

      <div className="grid md:grid-cols-3 gap-8 mt-10">

        {/* Order Date */}

        <div>

          <div className="flex items-center gap-2 text-gray-500">

            <CalendarDays size={18} />

            <span className="font-medium">
              Order Date
            </span>

          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {new Date(order.created_at).toLocaleDateString()}
          </p>

        </div>

        {/* Shipping Address */}

        <div>

          <div className="flex items-center gap-2 text-gray-500">

            <MapPin size={18} />

            <span className="font-medium">
              Shipping Address
            </span>

          </div>

          <p className="mt-2 font-semibold text-slate-900">

            {order.address || "Not Available"}

          </p>

        </div>

        {/* Payment */}

        <div>

          <div className="flex items-center gap-2 text-gray-500">

            <CreditCard size={18} />

            <span className="font-medium">
              Payment
            </span>

          </div>

          <p className="mt-2 font-semibold text-slate-900">

            Cash On Delivery

          </p>

        </div>

      </div>

    </div>
  );
};

export default OrderInfo;