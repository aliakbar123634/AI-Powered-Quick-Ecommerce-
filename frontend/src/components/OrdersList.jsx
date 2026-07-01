import React from "react";
import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";

const OrdersList = ({ orders }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-10">

      {orders.length > 0 ? (

        <div className="space-y-6">

          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}

        </div>

      ) : (

        <EmptyOrders />

      )}

    </section>
  );
};

export default OrdersList;