import React from "react";
import OrderItemCard from "./OrderItemCard";

const OrderItems = ({ items }) => {
  return (
    <div className="lg:col-span-8">

      <h2 className="text-3xl font-bold mb-6">
        Ordered Products
      </h2>

      <div className="space-y-6">

        {items.length > 0 ? (

          items.map((item) => (
            <OrderItemCard
              key={item.id}
              item={item}
            />
          ))

        ) : (

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">

            <h3 className="text-2xl font-semibold">
              No Products Found
            </h3>

            <p className="text-gray-500 mt-3">
              This order doesn't contain any products.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default OrderItems;