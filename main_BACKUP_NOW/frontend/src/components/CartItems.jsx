import React from "react";
import CartItemCard from "./CartItemCard";

const CartItems = ({
  items,
  onIncrease,
  onDecrease,
  onDelete,
}) => {
  return (
    <div className="lg:col-span-8">

      <h2 className="text-3xl font-bold mb-6">
        Shopping Cart
      </h2>

      <div className="space-y-6">

        {items.length > 0 ? (
          items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h3 className="text-2xl font-semibold">
              Your cart is empty
            </h3>

            <p className="text-gray-500 mt-2">
              Add some products to continue shopping.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default CartItems;