import { Users, Package, Truck, Star } from "lucide-react";

const StatsBar = () => {
  const stats = [
    {
      icon: <Users size={28} />,
      value: "10K+",
      label: "Active Users",
    },
    {
      icon: <Package size={28} />,
      value: "5000+",
      label: "Products",
    },
    {
      icon: <Truck size={28} />,
      value: "15 Min",
      label: "Avg Delivery",
    },
    {
      icon: <Star size={28} />,
      value: "98%",
      label: "Satisfaction",
    },
  ];

  return (
    <section className="bg-white py-10 border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((item, index) => (
            <div
              key={index}
              className="
              bg-[#F8FAFC]
              rounded-2xl
              p-6
              text-center
              border
              border-[#E2E8F0]
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
              duration-300
              "
            >
              <div className="flex justify-center text-[#2563EB] mb-4">
                {item.icon}
              </div>

              <h3 className="text-3xl font-bold text-[#0F172A]">
                {item.value}
              </h3>

              <p className="mt-2 text-gray-500">
                {item.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default StatsBar;