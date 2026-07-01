import React from "react";

const OrderItemCard = ({ item }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">

      <div className="flex flex-col md:flex-row gap-6">

        {/* Product Image */}

        <img
          src={item.product_image}   
          alt={item.product_name}
          style={{
        width: "180px",
        height: "180px",
        objectFit: "cover",
        display: "block",
        border: "2px solid red",
    }}
          onError={(e) => {
            console.log("Image Failed");
            console.log(item.product_image);
            console.log(e.target.src);
  }}
          className="w-40 h-40 rounded-2xl object-cover border"
        />

        {/* Product Info */}

        <div className="flex-1">

          <h2 className="text-2xl font-bold text-slate-900">
            {item.product_name}
          </h2>

          <div className="grid grid-cols-2 gap-6 mt-6">

            <div>

              <p className="text-gray-500">
                Price
              </p>

              <p className="font-semibold text-lg">
                ${item.product_price}
              </p>

            </div>

            <div>

              <p className="text-gray-500">
                Quantity
              </p>

              <p className="font-semibold text-lg">
                {item.quantity}
              </p>

            </div>

            <div>

              <p className="text-gray-500">
                Subtotal
              </p>

              <p className="font-semibold text-lg text-green-600">
                ${item.subtotal}
              </p>

            </div>

            <div>

              <p className="text-gray-500">
                Unit Price
              </p>

              <p className="font-semibold text-lg">
                ${item.price}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderItemCard;

