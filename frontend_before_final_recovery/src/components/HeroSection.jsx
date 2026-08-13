import { motion } from "framer-motion";
// import AIShoppingCard from "./AIShoppingCard";
import {
  Search,
  Sparkles,
  Truck,
  Clock,
  ArrowRight,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-[#F8FAFC] min-h-screen flex items-center">
  <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* Left Side */}
      <div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-medium">
          ✨ AI Powered Quick Commerce
        </div>

        <h1 className="mt-6 text-5xl lg:text-7xl font-bold leading-tight text-[#0F172A]">
          Get Anything
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Delivered In Minutes
          </span>
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-xl">
          Shop groceries, electronics and daily essentials with
          AI-powered recommendations and lightning-fast delivery.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition">
            Shop Now
          </button>

          <button className="border border-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-white transition">
            Explore Products
          </button>
        </div>

        {/* Search */}
        <div className="mt-10 bg-white p-3 rounded-2xl shadow-lg flex">
          <input
            type="text"
            placeholder="Search groceries, electronics, brands..."
            className="flex-1 outline-none px-4"
          />
          <button className="bg-[#2563EB] text-white px-6 py-3 rounded-xl">
            Search
          </button>
        </div>

      </div>
      

      {/* Right Side */}
      <div className="flex justify-center">

        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">

          <h3 className="text-2xl font-bold text-[#1E293B] mb-6">
            🤖 AI Shopping Assistant
          </h3>

          <div className="border-b pb-5">
            <h4 className="font-semibold mb-4">
              Recommended For You
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>🥛 Milk</span>
                <span className="text-green-600">98%</span>
              </div>

              <div className="flex justify-between">
                <span>🍎 Apples</span>
                <span className="text-green-600">96%</span>
              </div>

              <div className="flex justify-between">
                <span>🍞 Bread</span>
                <span className="text-green-600">95%</span>
              </div>
            </div>
          </div>

          <div className="py-5 border-b">
            <h4 className="font-semibold mb-2">
              Delivery ETA
            </h4>

            <p className="text-4xl font-bold text-[#2563EB]">
              12 min
            </p>
          </div>

          <div className="pt-5">
            <h4 className="font-semibold mb-2">
              Cart Value
            </h4>

            <p className="text-3xl font-bold text-[#16A34A]">
              $245
            </p>
          </div>

        </div>

      </div>
    </div>

  </div>
</section>
  );
};

export default HeroSection;



