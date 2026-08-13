import React from "react";

const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
  onDelete,
}) => {
  return (
    <div className="bg-white border rounded-2xl shadow p-5 flex gap-5">

      <img
        src={item.product_image}
        alt={item.product_name}
        className="w-28 h-28 rounded-xl object-cover"
      />

      <div className="flex-1">

        <h3 className="text-xl font-bold">
          {item.product_name}
        </h3>

        <p className="mt-2 text-gray-600">
          Price: ${item.product_price}
        </p>

        <p className="mt-2 font-semibold">
          Subtotal: ${item.subtotal}
        </p>

        <div className="flex items-center gap-3 mt-4">

          <button
            onClick={() =>
              onDecrease(item.product, item.quantity)
            }
            className="px-3 py-1 bg-gray-200 rounded"
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() =>
              onIncrease(item.product, item.quantity)
            }
            className="px-3 py-1 bg-gray-200 rounded"
          >
            +
          </button>

          <button
            onClick={() =>
              onDelete(item.product)
            }
            className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default CartItemCard;