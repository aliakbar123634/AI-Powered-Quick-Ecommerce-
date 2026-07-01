import React from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ProfileStats = () => {
  const stats = [
    {
      title: "Total Orders",
      value: 12,
      icon: <ShoppingBag size={26} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Pending",
      value: 2,
      icon: <Clock size={26} />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Delivered",
      value: 8,
      icon: <CheckCircle size={26} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Cancelled",
      value: 2,
      icon: <XCircle size={26} />,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mt-8">

      <h2 className="text-2xl font-bold mb-8">
        Account Statistics
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        {stats.map((stat, index) => (

          <div
            key={index}
            className="border rounded-2xl p-6 text-center hover:shadow-md transition"
          >

            <div
              className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${stat.color}`}
            >
              {stat.icon}
            </div>

            <h3 className="text-3xl font-bold mt-5">
              {stat.value}
            </h3>

            <p className="text-gray-500 mt-2">
              {stat.title}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ProfileStats;