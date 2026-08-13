import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { getAddresses } from "../api/addressApi";

import {
  ShoppingCart,
  User,
  Search,
  MapPin,
  Bot,
  Menu,
  X,
} from "lucide-react";
import { allCart } from "../api/orderApi";
import NotificationBell from "./NotificationBell";


const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchCart();
    fetchDefaultAddress();
  }, []);



const fetchCart = async () => {
    try {
        const response = await allCart();

        console.log(response.data);

        if (response.data.results.length > 0) {
            setCartCount(response.data.results[0].total_items);
        } else {
            setCartCount(0);
        }

    } catch (error) {
        console.error(error);
    }
};


const fetchDefaultAddress = async () => {
    try {

        const response = await getAddresses();

        const defaultAddress = response.data.results.find(
            (address) => address.is_default === true
        );

        if (defaultAddress) {
            setDefaultAddress(defaultAddress);
        }

    } catch (error) {
        console.error(error);
    }
};

  return (

<nav className="bg-[#1E293B] sticky top-0 z-50 shadow-lg">

  <div className="px-4 md:px-6 py-4">

    {/* TOP BAR */}
    <div className="flex items-center justify-between gap-4">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        {/* Mobile Menu */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden text-white"
        >
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#2563EB] font-bold text-2xl md:text-3xl"
        >
          ⚡
          <span>QuickAI</span>
        </Link>

      </div>

      {/* Location */}
      <div
        className="hidden xl:flex items-center gap-2 text-white cursor-pointer"
        onClick={() => navigate("/location")}
      >

        <MapPin
          size={22}
          className="text-green-500"
        />

        <div>

          <p className="text-xs text-gray-300">
            Delivered to
          </p>

          {/* <p className="font-semibold">
            Johar Town, Lahore
          </p> */}
          {/* <p className="font-semibold">
          {defaultAddress
        ? `${defaultAddress.area}, ${defaultAddress.city}`
        : "Choose Location"}
          </p> */}

          <p className="font-semibold">
            {defaultAddress
            ? `${defaultAddress.area}, ${defaultAddress.city}`
            : "Choose Location"}
          </p>
        </div>

      </div>

      {/* Search */}
      <div
        className="
        hidden
        md:flex
        flex-1
        max-w-[600px]
        items-center
        bg-white
        rounded-xl
        px-4
        py-3
        "
      >

        <Search
          size={20}
          className="text-gray-500"
        />

        <input
          placeholder="Search products..."
          className="ml-3 w-full outline-none text-gray-700"
        />

      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* AI */}
        <button
          onClick={() => navigate("/ai-chat")}
          className="
          hidden
          sm:flex
          items-center
          gap-2
          px-3
          py-2
          rounded-xl
          bg-gradient-to-r
        from-blue-600
         to-purple-600
        text-white
          hover:scale-105
         transition
        "
      >

          <Bot size={20} />

          <span className="hidden lg:block">
            AI
          </span>

        </button>

        {/* Notification */}

        <div className="text-white">

          <NotificationBell />

        </div>

        {/* Cart */}

        <Link
          to="/cart"
          className="relative text-white hover:text-green-500"
        >

          <ShoppingCart size={26} />

          <span
            className="
            absolute
            -top-2
            -right-2
            bg-green-500
            text-white
            text-xs
            w-5
            h-5
            rounded-full
            flex
            items-center
            justify-center
            "
          >

            {cartCount}

          </span>

        </Link>

        {/* User */}

        <Link
          to="/profile"
          className="text-white hover:text-blue-500"
        >

          <User size={26} />

        </Link>

      </div>

    </div>

    {/* Mobile Search */}

    <div className="md:hidden mt-4">

      <div className="flex items-center bg-white rounded-xl px-4 py-3">

        <Search
          size={20}
          className="text-gray-500"
        />

        <input
          placeholder="Search..."
          className="ml-3 w-full outline-none"
        />

      </div>

    </div>

    {/* Desktop Menu */}

    <div
      className="
      hidden
      lg:flex
      gap-12
      mt-5
      text-white
      font-medium
      "
    >

      <Link to="/">Home</Link>

      <Link to="/category">Categories</Link>

      <Link to="/orders">Orders</Link>

      <Link to="/deals">Deals</Link>

    </div>

    {/* Mobile Menu */}

    {mobileMenu && (

      <div
        className="
        lg:hidden
        mt-5
        bg-[#111827]
        rounded-xl
        p-4
        space-y-4
        "
      >

        <Link
          to="/"
          onClick={() => setMobileMenu(false)}
          className="block text-white"
        >
          Home
        </Link>

        <Link
          to="/category"
          onClick={() => setMobileMenu(false)}
          className="block text-white"
        >
          Categories
        </Link>

        <Link
          to="/orders"
          onClick={() => setMobileMenu(false)}
          className="block text-white"
        >
          Orders
        </Link>

        <Link
          to="/deals"
          onClick={() => setMobileMenu(false)}
          className="block text-white"
        >
          Deals
        </Link>

      </div>

    )}

  </div>

</nav>

  );

};


export default Navbar;