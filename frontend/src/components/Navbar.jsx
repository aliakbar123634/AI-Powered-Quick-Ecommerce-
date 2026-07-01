import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, MapPin, Bot } from "lucide-react";

const Navbar = () => {
  return (
    <div>
      <nav className="bg-[#1E293B] sticky p-4">
        {/* Top Row */}
        <div className="justify-between flex items-center pb-2 ">
          <Link to="/" className="flex gap-2 text-[#2563EB] font-bold text-2xl">
            ⚡<span>QuickAI</span>
          </Link>
          <div className="items-center  flex gap-2 text-white">
            <MapPin size={18} className="text-[#16A34A]" />
            <div className="leading-tight">
              <p className="text-sx text-gray-300">Delivered to</p>
              <div className="font-medium">Johar Town, Lahore</div>
            </div>
          </div>
          <div className="hidden md:flex items-center bg-white w-[600px] rounded-xl px-4 py-3 shadow-md">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products, groceries, brands..."
              className="ml-3 w-full outline-none text-gray-700"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className=" lg:flex items-center gap-2 px-2 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition">
              <Bot size={18} />
              AI
            </button>
            <Link
              to="/cart"
              className="relative text-white hover:text-[#16A34A]"
            >
              <ShoppingCart size={28} />

              <span className="absolute -top-2 -right-2 bg-[#16A34A] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </Link>
                 <Link
              to="/profile"
              className="text-white hover:text-[#2563EB]"
            >
              <User size={28} />
            </Link>
          </div>
        </div>

        <div className="flex gap-10 text-white ">
          <Link
            to="/"
            className="hover:text-[#2563EB] transition"
          >
            Home
          </Link>

          <Link
            to="/category"
            className="hover:text-[#2563EB] transition"
          >
            Categories
          </Link>

          <Link
            to="/orders"
            className="hover:text-[#2563EB] transition"
          >
            Orders
          </Link>

          <Link
            to="/deals"
            className="hover:text-[#F59E0B] transition"
          >
            Deals
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
