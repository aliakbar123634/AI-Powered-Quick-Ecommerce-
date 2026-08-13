import { Truck } from "lucide-react";

const RiderHeader = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-8 text-white shadow-lg">

      <div className="flex items-center gap-4">

        <Truck size={42} />

        <div>

          <h1 className="text-4xl font-bold">
            Rider Dashboard
          </h1>

          <p className="mt-2 text-green-100">
            Welcome back 👋
          </p>

        </div>

      </div>

    </div>
  );
};

export default RiderHeader;