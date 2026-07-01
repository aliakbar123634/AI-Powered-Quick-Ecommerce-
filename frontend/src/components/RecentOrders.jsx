import React from "react";
import { Link } from "react-router-dom";

const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mt-8">

      <div className="flex items-center justify-between mb-8">

        <h2 className="text-2xl font-bold">
          Recent Orders
        </h2>

        <Link
          to="/orders"
          className="text-green-600 hover:text-green-700 font-semibold"
        >
          View All
        </Link>

      </div>

      {orders?.length > 0 ? (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-4">Order #</th>

                <th className="text-left py-4">Date</th>

                <th className="text-left py-4">Items</th>

                <th className="text-left py-4">Status</th>

                <th className="text-right py-4">Total</th>

              </tr>

            </thead>

            <tbody>

              {orders.slice(0, 5).map((order) => (

                <tr
                  key={order.id}
                  className="border-b last:border-none"
                >

                  <td className="py-5 font-semibold">
                    {order.order_number}
                  </td>

                  <td className="py-5">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  <td className="py-5">
                    {order.total_items}
                  </td>

                  <td className="py-5">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium

                        ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {order.status}
                    </span>

                  </td>

                  <td className="py-5 text-right font-bold text-green-600">
                    ${order.total_price}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ) : (

        <div className="text-center py-12">

          <h3 className="text-xl font-semibold">
            No Orders Yet
          </h3>

          <p className="text-gray-500 mt-2">
            Your recent orders will appear here.
          </p>

        </div>

      )}

    </div>
  );
};

export default RecentOrders;