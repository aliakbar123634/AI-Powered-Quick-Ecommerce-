// import React from "react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { getAddresses } from "../api/addressApi";

// import {
//   ShoppingCart,
//   User,
//   Search,
//   MapPin,
//   Bot,
//   Menu,
//   X,
// } from "lucide-react";
// import { allCart } from "../api/orderApi";
// import NotificationBell from "./NotificationBell";


// const Navbar = () => {
//   const [cartCount, setCartCount] = useState(0);
//   const [mobileMenu, setMobileMenu] = useState(false);
//   const [defaultAddress, setDefaultAddress] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => {
//     fetchCart();
//     fetchDefaultAddress();
//   }, []);



// const fetchCart = async () => {
//     try {
//         const response = await allCart();

//         console.log(response.data);

//         if (response.data.results.length > 0) {
//             setCartCount(response.data.results[0].total_items);
//         } else {
//             setCartCount(0);
//         }

//     } catch (error) {
//         console.error(error);
//     }
// };


// const fetchDefaultAddress = async () => {
//     try {

//         const response = await getAddresses();

//         const defaultAddress = response.data.results.find(
//             (address) => address.is_default === true
//         );

//         if (defaultAddress) {
//             setDefaultAddress(defaultAddress);
//         }

//     } catch (error) {
//         console.error(error);
//     }
// };

//   return (

// <nav className="bg-[#1E293B] sticky top-0 z-50 shadow-lg">

//   <div className="px-4 md:px-6 py-4">

//     {/* TOP BAR */}
//     <div className="flex items-center justify-between gap-4">

//       {/* LEFT */}
//       <div className="flex items-center gap-4">

//         {/* Mobile Menu */}
//         <button
//           onClick={() => setMobileMenu(!mobileMenu)}
//           className="lg:hidden text-white"
//         >
//           {mobileMenu ? <X size={28} /> : <Menu size={28} />}
//         </button>

//         {/* Logo */}
//         <Link
//           to="/"
//           className="flex items-center gap-2 text-[#2563EB] font-bold text-2xl md:text-3xl"
//         >
//           ΓÜí
//           <span>QuickAI</span>
//         </Link>

//       </div>

//       {/* Location */}
//       <div
//         className="hidden xl:flex items-center gap-2 text-white cursor-pointer"
//         onClick={() => navigate("/location")}
//       >

//         <MapPin
//           size={22}
//           className="text-green-500"
//         />

//         <div>

//           <p className="text-xs text-gray-300">
//             Delivered to
//           </p>

//           {/* <p className="font-semibold">
//             Johar Town, Lahore
//           </p> */}
//           {/* <p className="font-semibold">
//           {defaultAddress
//         ? `${defaultAddress.area}, ${defaultAddress.city}`
//         : "Choose Location"}
//           </p> */}

//           <p className="font-semibold">
//             {defaultAddress
//             ? `${defaultAddress.area}, ${defaultAddress.city}`
//             : "Choose Location"}
//           </p>
//         </div>

//       </div>

//       {/* Search */}
//       <div
//         className="
//         hidden
//         md:flex
//         flex-1
//         max-w-[600px]
//         items-center
//         bg-white
//         rounded-xl
//         px-4
//         py-3
//         "
//       >

//         <Search
//           size={20}
//           className="text-gray-500"
//         />

//         <input
//           placeholder="Search products..."
//           className="ml-3 w-full outline-none text-gray-700"
//         />

//       </div>

//       {/* Right Icons */}
//       <div className="flex items-center gap-3 md:gap-5">

//         {/* AI */}
//         <button
//           onClick={() => navigate("/ai-chat")}
//           className="
//           hidden
//           sm:flex
//           items-center
//           gap-2
//           px-3
//           py-2
//           rounded-xl
//           bg-gradient-to-r
//         from-blue-600
//          to-purple-600
//         text-white
//           hover:scale-105
//          transition
//         "
//       >

//           <Bot size={20} />

//           <span className="hidden lg:block">
//             AI
//           </span>

//         </button>

//         {/* Notification */}

//         <div className="text-white">

//           <NotificationBell />

//         </div>

//         {/* Cart */}

//         <Link
//           to="/cart"
//           className="relative text-white hover:text-green-500"
//         >

//           <ShoppingCart size={26} />

//           <span
//             className="
//             absolute
//             -top-2
//             -right-2
//             bg-green-500
//             text-white
//             text-xs
//             w-5
//             h-5
//             rounded-full
//             flex
//             items-center
//             justify-center
//             "
//           >

//             {cartCount}

//           </span>

//         </Link>

//         {/* User */}

//         <Link
//           to="/profile"
//           className="text-white hover:text-blue-500"
//         >

//           <User size={26} />

//         </Link>

//       </div>

//     </div>

//     {/* Mobile Search */}

//     <div className="md:hidden mt-4">

//       <div className="flex items-center bg-white rounded-xl px-4 py-3">

//         <Search
//           size={20}
//           className="text-gray-500"
//         />

//         <input
//           placeholder="Search..."
//           className="ml-3 w-full outline-none"
//         />

//       </div>

//     </div>

//     {/* Desktop Menu */}

//     <div
//       className="
//       hidden
//       lg:flex
//       gap-12
//       mt-5
//       text-white
//       font-medium
//       "
//     >

//       <Link to="/">Home</Link>

//       <Link to="/category">Categories</Link>

//       <Link to="/orders">Orders</Link>

//       <Link to="/deals">Deals</Link>

//     </div>

//     {/* Mobile Menu */}

//     {mobileMenu && (

//       <div
//         className="
//         lg:hidden
//         mt-5
//         bg-[#111827]
//         rounded-xl
//         p-4
//         space-y-4
//         "
//       >

//         <Link
//           to="/"
//           onClick={() => setMobileMenu(false)}
//           className="block text-white"
//         >
//           Home
//         </Link>

//         <Link
//           to="/category"
//           onClick={() => setMobileMenu(false)}
//           className="block text-white"
//         >
//           Categories
//         </Link>

//         <Link
//           to="/orders"
//           onClick={() => setMobileMenu(false)}
//           className="block text-white"
//         >
//           Orders
//         </Link>

//         <Link
//           to="/deals"
//           onClick={() => setMobileMenu(false)}
//           className="block text-white"
//         >
//           Deals
//         </Link>

//       </div>

//     )}

//   </div>

// </nav>

//   );

// };


// export default Navbar;




import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  ShoppingCart,
  User,
  Search,
  MapPin,
  Bot,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import { getAddresses } from "../api/addressApi";
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

  const openAI = () => {
    setMobileMenu(false);
    navigate("/ai-chat");
  };

  return (
    <header className="w-full bg-[#111827] text-white px-3 sm:px-5 lg:px-8 py-3 sm:py-4">

      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-[56px]">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">

          {/* Mobile Menu Button */}

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="
              lg:hidden
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              text-white
              hover:bg-white/10
              active:bg-white/20
              transition
              shrink-0
            "
            aria-label="Toggle menu"
          >
            {mobileMenu ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>


          {/* Logo */}

          <Link
            to="/"
            className="
              flex
              items-center
              gap-1.5
              sm:gap-2
              text-[#3B82F6]
              font-bold
              text-xl
              sm:text-2xl
              md:text-3xl
              shrink-0
            "
          >
            <span className="text-2xl sm:text-3xl">
              ΓÜí
            </span>

            <span>
              QuickAI
            </span>
          </Link>

        </div>


        {/* =================================================
            LOCATION
        ================================================= */}

        <div
          className="
            hidden
            xl:flex
            items-center
            gap-2
            text-white
            cursor-pointer
            hover:bg-white/5
            rounded-xl
            px-3
            py-2
            transition
            shrink-0
          "
          onClick={() => navigate("/location")}
        >

          <MapPin
            size={22}
            className="text-green-500 shrink-0"
          />

          <div className="min-w-0">

            <p className="text-xs text-gray-400">
              Delivered to
            </p>

            <p className="font-semibold text-sm max-w-[190px] truncate">
              {defaultAddress
                ? `${defaultAddress.area}, ${defaultAddress.city}`
                : "Choose Location"}
            </p>

          </div>

        </div>


        {/* =================================================
            DESKTOP SEARCH
        ================================================= */}

        <div
          className="
            hidden
            md:flex
            flex-1
            max-w-[620px]
            items-center
            bg-white
            rounded-2xl
            px-4
            py-3
            shadow-sm
            border
            border-gray-200
            focus-within:ring-2
            focus-within:ring-blue-500/50
          "
        >

          <Search
            size={21}
            className="text-gray-500 shrink-0"
          />

          <input
            type="text"
            placeholder="Search products..."
            className="
              ml-3
              w-full
              outline-none
              text-gray-700
              bg-transparent
              placeholder:text-gray-400
            "
          />

        </div>


        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-1
            sm:gap-2
            md:gap-3
            shrink-0
          "
        >

          {/* =================================================
              AI ASSISTANT
          ================================================= */}

          <button
            onClick={openAI}
            className="
              group
              relative
              flex
              items-center
              justify-center
              gap-1.5
              sm:gap-2

              h-10
              sm:h-11

              px-3
              sm:px-4

              rounded-xl
              sm:rounded-2xl

              bg-gradient-to-r
              from-blue-600
              via-indigo-600
              to-purple-600

              text-white

              shadow-lg
              shadow-blue-500/30

              hover:shadow-blue-500/50
              hover:scale-[1.03]

              active:scale-95

              transition-all
              duration-200

              shrink-0
            "
            title="AI Shopping Assistant"
          >

            {/* Glow */}

            <span
              className="
                absolute
                inset-0
                rounded-xl
                sm:rounded-2xl
                bg-gradient-to-r
                from-blue-400
                to-purple-400
                opacity-0
                group-hover:opacity-20
                blur-xl
                transition
              "
            />

            <Bot
              size={21}
              className="
                relative
                z-10
                sm:w-[22px]
                sm:h-[22px]
              "
            />

            <span
              className="
                relative
                z-10
                font-bold
                text-xs
                sm:text-sm
                md:text-base
              "
            >
              AI
            </span>

            <Sparkles
              size={12}
              className="
                relative
                z-10
                text-purple-200
                hidden
                sm:block
              "
            />

          </button>


          {/* =================================================
              NOTIFICATION
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              hover:bg-white/10
              transition
            "
          >
            <NotificationBell />
          </div>


          {/* =================================================
              CART
          ================================================= */}

          <Link
            to="/cart"
            className="
              relative
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              text-white
              hover:bg-white/10
              hover:text-green-400
              transition
            "
            title="Shopping Cart"
          >

            <ShoppingCart size={25} />

            <span
              className="
                absolute
                -top-1
                -right-1

                bg-green-500
                text-white

                text-[10px]
                sm:text-xs

                font-bold

                min-w-[18px]
                h-[18px]

                px-1

                rounded-full

                flex
                items-center
                justify-center

                border-2
                border-[#111827]
              "
            >
              {cartCount}
            </span>

          </Link>


          {/* =================================================
              USER
          ================================================= */}

          <Link
            to="/profile"
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-xl
              text-white
              hover:bg-white/10
              hover:text-blue-400
              transition
            "
            title="Profile"
          >

            <User size={25} />

          </Link>

        </div>

      </div>


      {/* =====================================================
          MOBILE SEARCH
      ===================================================== */}

      <div className="md:hidden mt-3">

        <div
          className="
            flex
            items-center
            bg-white
            rounded-2xl
            px-4
            py-3
            shadow-sm
            border
            border-gray-200
            focus-within:ring-2
            focus-within:ring-blue-500/50
          "
        >

          <Search
            size={19}
            className="text-gray-500 shrink-0"
          />

          <input
            type="text"
            placeholder="Search products..."
            className="
              ml-3
              w-full
              outline-none
              text-gray-700
              bg-transparent
              text-sm
              placeholder:text-gray-400
            "
          />

        </div>

      </div>


      {/* =====================================================
          DESKTOP NAVIGATION
      ===================================================== */}

      <div
        className="
          hidden
          lg:flex
          items-center
          gap-10
          mt-5
          pt-2
          border-t
          border-white/10
          text-white
          font-medium
        "
      >

        <Link
          to="/"
          className="
            hover:text-blue-400
            transition
          "
        >
          Home
        </Link>

        <Link
          to="/category"
          className="
            hover:text-blue-400
            transition
          "
        >
          Categories
        </Link>

        <Link
          to="/orders"
          className="
            hover:text-blue-400
            transition
          "
        >
          Orders
        </Link>

        <Link
          to="/deals"
          className="
            hover:text-blue-400
            transition
          "
        >
          Deals
        </Link>

      </div>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileMenu && (

        <div
          className="
            lg:hidden
            mt-4
            bg-[#0B1220]
            border
            border-white/10
            rounded-2xl
            p-3
            space-y-1
            shadow-2xl
          "
        >

          {/* =================================================
              MOBILE AI
          ================================================= */}

          <button
            onClick={openAI}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3.5

              rounded-xl

              bg-gradient-to-r
              from-blue-600
              to-purple-600

              text-white
              font-semibold

              shadow-lg
              shadow-blue-500/20

              hover:scale-[1.01]
              active:scale-[0.99]

              transition
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-white/15
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <Bot size={22} />
            </div>

            <div className="text-left">

              <p className="text-sm font-bold">
                AI Shopping Assistant
              </p>

              <p className="text-xs text-blue-100 mt-0.5">
                Find products & get recommendations
              </p>

            </div>

            <Sparkles
              size={18}
              className="ml-auto text-purple-200"
            />

          </button>


          {/* =================================================
              HOME
          ================================================= */}

          <Link
            to="/"
            onClick={() => setMobileMenu(false)}
            className="
              block
              px-4
              py-3
              rounded-xl
              text-white
              hover:bg-white/10
              transition
            "
          >
            Home
          </Link>


          {/* =================================================
              CATEGORIES
          ================================================= */}

          <Link
            to="/category"
            onClick={() => setMobileMenu(false)}
            className="
              block
              px-4
              py-3
              rounded-xl
              text-white
              hover:bg-white/10
              transition
            "
          >
            Categories
          </Link>


          {/* =================================================
              ORDERS
          ================================================= */}

          <Link
            to="/orders"
            onClick={() => setMobileMenu(false)}
            className="
              block
              px-4
              py-3
              rounded-xl
              text-white
              hover:bg-white/10
              transition
            "
          >
            Orders
          </Link>


          {/* =================================================
              DEALS
          ================================================= */}

          <Link
            to="/deals"
            onClick={() => setMobileMenu(false)}
            className="
              block
              px-4
              py-3
              rounded-xl
              text-white
              hover:bg-white/10
              transition
            "
          >
            Deals
          </Link>


          {/* =================================================
              PROFILE
          ================================================= */}

          <Link
            to="/profile"
            onClick={() => setMobileMenu(false)}
            className="
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-white
              hover:bg-white/10
              transition
            "
          >

            <User size={20} />

            Profile

          </Link>


          {/* =================================================
              LOCATION
          ================================================= */}

          <button
            onClick={() => {
              setMobileMenu(false);
              navigate("/location");
            }}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-white
              hover:bg-white/10
              transition
              text-left
            "
          >

            <MapPin
              size={20}
              className="text-green-500 shrink-0"
            />

            <div className="min-w-0">

              <p className="text-xs text-gray-400">
                Deliver to
              </p>

              <p className="text-sm font-semibold truncate">
                {defaultAddress
                  ? `${defaultAddress.area}, ${defaultAddress.city}`
                  : "Choose Location"}
              </p>

            </div>

          </button>

        </div>

      )}

    </header>
  );
};

export default Navbar;
