import React from "react";

const OrderStatusBadge = ({ status }) => {

  const getColor = () => {

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

    <span
      className={`
        px-4
        py-2
        rounded-full
        text-sm
        font-semibold
        ${getColor()}
      `}
    >
      {status}
    </span>

  );

};

export default OrderStatusBadge;