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
import { getProducts } from "../api/productApi";
import NotificationBell from "./NotificationBell";


const Navbar = () => {

  // =========================================================
  // BASIC STATES
  // =========================================================

  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);


  // =========================================================
  // SEARCH STATES
  // =========================================================

  const [navbarSearch, setNavbarSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);


  const navigate = useNavigate();


  // =========================================================
  // INITIAL DATA
  // =========================================================

  useEffect(() => {

    fetchCart();
    fetchDefaultAddress();

  }, []);


  // =========================================================
  // FETCH CART
  // =========================================================

  const fetchCart = async () => {

    try {

      const response = await allCart();

      console.log("Cart:", response.data);

      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {

        setCartCount(
          response.data.results[0].total_items
        );

      } else {

        setCartCount(0);

      }

    } catch (error) {

      console.error("Cart fetch error:", error);

      setCartCount(0);

    }

  };


  // =========================================================
  // FETCH DEFAULT ADDRESS
  // =========================================================

  const fetchDefaultAddress = async () => {

    try {

      const response = await getAddresses();

      const addresses = response.data?.results || [];

      const defaultAddress = addresses.find(
        (address) => address.is_default === true
      );

      if (defaultAddress) {

        setDefaultAddress(defaultAddress);

      }

    } catch (error) {

      console.error(
        "Default address fetch error:",
        error
      );

    }

  };


  // =========================================================
  // AI ASSISTANT
  // =========================================================

  const openAI = () => {

    setMobileMenu(false);

    setShowSearchResults(false);

    navigate("/ai-chat");

  };


  // =========================================================
  // SEARCH INPUT CHANGE
  // =========================================================

  const handleSearchChange = (e) => {

    const value = e.target.value;

    setNavbarSearch(value);

    // Empty search
    if (!value.trim()) {

      setSearchResults([]);

      setShowSearchResults(false);

      setSearchLoading(false);

      return;

    }

    setShowSearchResults(true);

  };


  // =========================================================
  // LIVE PRODUCT SEARCH
  // =========================================================

  useEffect(() => {

    const query = navbarSearch.trim();


    // Minimum 2 characters
    if (query.length < 2) {

      setSearchResults([]);

      setSearchLoading(false);

      return;

    }


    // Debounce
    const timer = setTimeout(async () => {

      try {

        setSearchLoading(true);


        const response = await getProducts(
          1,      // page
          query,  // search
          "",     // ordering
          "",     // category
          "",     // stock status
          "",     // min price
          "",     // max price
          "",     // rating
          ""      // discount
        );


        const results =
          response.data?.results || [];


        // Only show first 3 products
        setSearchResults(
          results.slice(0, 3)
        );

        setShowSearchResults(true);


      } catch (error) {

        console.error(
          "Navbar product search error:",
          error
        );

        setSearchResults([]);

      } finally {

        setSearchLoading(false);

      }

    }, 300);


    // Cleanup debounce
    return () => {

      clearTimeout(timer);

    };

  }, [navbarSearch]);


  // =========================================================
  // GET PRODUCT IMAGE
  // =========================================================

  const getProductImage = (product) => {

    if (!product) {
      return null;
    }


    // images array
    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {

      const firstImage = product.images[0];

      if (typeof firstImage === "string") {

        return firstImage;

      }

      if (firstImage?.image) {

        return firstImage.image;

      }

      if (firstImage?.image_url) {

        return firstImage.image_url;

      }

      if (firstImage?.url) {

        return firstImage.url;

      }

    }


    // Direct image fields
    if (product.image) {

      return product.image;

    }

    if (product.image_url) {

      return product.image_url;

    }

    if (product.thumbnail) {

      return product.thumbnail;

    }


    return null;

  };


  // =========================================================
  // PRODUCT CLICK
  // =========================================================

  const handleProductClick = (product) => {

    if (!product?.id) {
      return;
    }


    // Close search dropdown
    setShowSearchResults(false);

    // Clear search input
    setNavbarSearch("");

    // Close mobile menu
    setMobileMenu(false);


    // Go directly to product detail
    navigate(`/products/${product.id}`);

  };


  // =========================================================
  // GO TO LOCATION
  // =========================================================

  const handleLocation = () => {

    setMobileMenu(false);

    setShowSearchResults(false);

    navigate("/location");

  };


  // =========================================================
  // CLOSE SEARCH
  // =========================================================

  const closeSearch = () => {

    setShowSearchResults(false);

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <header
      className="
        w-full
        bg-[#111827]
        text-white
        px-3
        sm:px-5
        lg:px-8
        py-3
        sm:py-4
      "
    >


      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
          sm:gap-4
          min-h-[56px]
        "
      >


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-4
            min-w-0
          "
        >


          {/* Mobile Menu Button */}

          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
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
          onClick={handleLocation}
        >

          <MapPin
            size={22}
            className="text-green-500 shrink-0"
          />


          <div className="min-w-0">

            <p className="text-xs text-gray-400">
              Delivered to
            </p>


            <p
              className="
                font-semibold
                text-sm
                max-w-[190px]
                truncate
              "
            >

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
            relative
            hidden
            md:flex
            flex-1
            max-w-[620px]
          "
        >

          {/* Search Box */}

          <div
            className="
              w-full
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
              size={21}
              className="
                text-gray-500
                shrink-0
              "
            />


            <input
              type="text"
              value={navbarSearch}
              onChange={handleSearchChange}
              onFocus={() => {

                if (
                  navbarSearch.trim() &&
                  searchResults.length > 0
                ) {

                  setShowSearchResults(true);

                }

              }}
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


            {/* Loading */}

            {searchLoading && (

              <div
                className="
                  text-xs
                  text-gray-400
                  whitespace-nowrap
                "
              >
                Searching...
              </div>

            )}

          </div>


          {/* =================================================
              DESKTOP SEARCH DROPDOWN
          ================================================= */}

          {showSearchResults &&
            navbarSearch.trim() && (

              <div
                className="
                  absolute
                  top-full
                  left-0
                  right-0
                  mt-2
                  bg-white
                  rounded-2xl
                  shadow-2xl
                  border
                  border-gray-200
                  overflow-hidden
                  z-[999]
                "
              >


                {/* Loading */}

                {searchLoading ? (

                  <div
                    className="
                      px-5
                      py-5
                      text-gray-500
                      text-sm
                    "
                  >

                    Searching products...

                  </div>

                ) : searchResults.length > 0 ? (


                  /* Results */

                  <div>

                    {searchResults.map(
                      (product) => {

                        const image =
                          getProductImage(product);


                        return (

                          <button
                            key={product.id}
                            type="button"
                            onClick={() =>
                              handleProductClick(
                                product
                              )
                            }
                            className="
                              w-full
                              flex
                              items-center
                              gap-4
                              px-5
                              py-4
                              text-left
                              hover:bg-gray-50
                              transition
                              border-b
                              border-gray-100
                              last:border-b-0
                            "
                          >


                            {/* Product Image */}

                            <div
                              className="
                                w-14
                                h-14
                                rounded-xl
                                bg-gray-100
                                overflow-hidden
                                shrink-0
                                flex
                                items-center
                                justify-center
                              "
                            >

                              {image ? (

                                <img
                                  src={image}
                                  alt={
                                    product.name ||
                                    "Product"
                                  }
                                  className="
                                    w-full
                                    h-full
                                    object-cover
                                  "
                                />

                              ) : (

                                <Search
                                  size={20}
                                  className="
                                    text-gray-400
                                  "
                                />

                              )}

                            </div>


                            {/* Product Information */}

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >

                              <p
                                className="
                                  font-semibold
                                  text-gray-800
                                  truncate
                                "
                              >

                                {product.name ||
                                  "Unnamed Product"}

                              </p>


                              <p
                                className="
                                  text-sm
                                  text-gray-500
                                  truncate
                                  mt-0.5
                                "
                              >

                                {product.category_name ||
                                  "Product"}

                              </p>


                              {product.discount_price && (

                                <p
                                  className="
                                    text-sm
                                    font-semibold
                                    text-blue-600
                                    mt-1
                                  "
                                >

                                  $
                                  {product.discount_price}

                                </p>

                              )}

                            </div>


                            {/* Arrow */}

                            <div
                              className="
                                text-gray-400
                                text-lg
                              "
                            >

                              →

                            </div>


                          </button>

                        );

                      }
                    )}

                  </div>


                ) : (


                  /* No Results */

                  <div
                    className="
                      px-5
                      py-5
                      text-gray-500
                      text-sm
                    "
                  >

                    No products found.

                  </div>

                )}

              </div>

            )}

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
            onClick={closeSearch}
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
            onClick={closeSearch}
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

      <div
        className="
          md:hidden
          mt-3
          relative
        "
      >

        {/* Mobile Search Box */}

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
            className="
              text-gray-500
              shrink-0
            "
          />


          <input
            type="text"
            value={navbarSearch}
            onChange={handleSearchChange}
            onFocus={() => {

              if (
                navbarSearch.trim() &&
                searchResults.length > 0
              ) {

                setShowSearchResults(true);

              }

            }}
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


          {searchLoading && (

            <div
              className="
                text-xs
                text-gray-400
                whitespace-nowrap
              "
            >

              ...

            </div>

          )}

        </div>


        {/* =================================================
            MOBILE SEARCH RESULTS
        ================================================= */}

        {showSearchResults &&
          navbarSearch.trim() && (

            <div
              className="
                absolute
                top-full
                left-0
                right-0
                mt-2
                bg-white
                rounded-2xl
                shadow-2xl
                border
                border-gray-200
                overflow-hidden
                z-[999]
              "
            >

              {searchLoading ? (

                <div
                  className="
                    px-5
                    py-5
                    text-gray-500
                    text-sm
                  "
                >

                  Searching products...

                </div>

              ) : searchResults.length > 0 ? (

                searchResults.map(
                  (product) => {

                    const image =
                      getProductImage(product);


                    return (

                      <button
                        key={product.id}
                        type="button"
                        onClick={() =>
                          handleProductClick(
                            product
                          )
                        }
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          text-left
                          hover:bg-gray-50
                          transition
                          border-b
                          border-gray-100
                          last:border-b-0
                        "
                      >

                        {/* Image */}

                        <div
                          className="
                            w-12
                            h-12
                            rounded-lg
                            bg-gray-100
                            overflow-hidden
                            shrink-0
                            flex
                            items-center
                            justify-center
                          "
                        >

                          {image ? (

                            <img
                              src={image}
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="
                                w-full
                                h-full
                                object-cover
                              "
                            />

                          ) : (

                            <Search
                              size={18}
                              className="
                                text-gray-400
                              "
                            />

                          )}

                        </div>


                        {/* Information */}

                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <p
                            className="
                              font-semibold
                              text-gray-800
                              text-sm
                              truncate
                            "
                          >

                            {product.name ||
                              "Unnamed Product"}

                          </p>


                          <p
                            className="
                              text-xs
                              text-gray-500
                              truncate
                              mt-0.5
                            "
                          >

                            {product.category_name ||
                              "Product"}

                          </p>


                          {product.discount_price && (

                            <p
                              className="
                                text-xs
                                font-semibold
                                text-blue-600
                                mt-1
                              "
                            >

                              $
                              {product.discount_price}

                            </p>

                          )}

                        </div>


                        <span
                          className="
                            text-gray-400
                            text-lg
                          "
                        >

                          →

                        </span>

                      </button>

                    );

                  }
                )

              ) : (

                <div
                  className="
                    px-5
                    py-5
                    text-gray-500
                    text-sm
                  "
                >

                  No products found.

                </div>

              )}

            </div>

          )}

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
          onClick={closeSearch}
          className="
            hover:text-blue-400
            transition
          "
        >

          Home

        </Link>


        <Link
          to="/category"
          onClick={closeSearch}
          className="
            hover:text-blue-400
            transition
          "
        >

          Categories

        </Link>


        <Link
          to="/orders"
          onClick={closeSearch}
          className="
            hover:text-blue-400
            transition
          "
        >

          Orders

        </Link>


        <Link
          to="/deals"
          onClick={closeSearch}
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


          {/* MOBILE AI */}

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

              <p
                className="
                  text-xs
                  text-blue-100
                  mt-0.5
                "
              >
                Find products & get recommendations
              </p>

            </div>


            <Sparkles
              size={18}
              className="
                ml-auto
                text-purple-200
              "
            />

          </button>


          {/* HOME */}

          <Link
            to="/"
            onClick={() => {

              setMobileMenu(false);
              closeSearch();

            }}
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


          {/* CATEGORIES */}

          <Link
            to="/category"
            onClick={() => {

              setMobileMenu(false);
              closeSearch();

            }}
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


          {/* ORDERS */}

          <Link
            to="/orders"
            onClick={() => {

              setMobileMenu(false);
              closeSearch();

            }}
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


          {/* DEALS */}

          <Link
            to="/deals"
            onClick={() => {

              setMobileMenu(false);
              closeSearch();

            }}
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


          {/* PROFILE */}

          <Link
            to="/profile"
            onClick={() => {

              setMobileMenu(false);
              closeSearch();

            }}
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


          {/* LOCATION */}

          <button
            onClick={handleLocation}
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
              className="
                text-green-500
                shrink-0
              "
            />


            <div className="min-w-0">

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Deliver to
              </p>


              <p
                className="
                  text-sm
                  font-semibold
                  truncate
                "
              >

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