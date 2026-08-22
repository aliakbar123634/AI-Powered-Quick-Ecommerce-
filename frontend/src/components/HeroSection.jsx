import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { getProducts } from "../api/productApi";


const HeroSection = () => {

  const navigate = useNavigate();


  // =========================================================
  // SEARCH STATES
  // =========================================================

  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const [searchLoading, setSearchLoading] = useState(false);

  const [showSearchResults, setShowSearchResults] = useState(false);


  // =========================================================
  // LIVE SEARCH
  // =========================================================

  useEffect(() => {

    const query = search.trim();


    // Empty search
    if (!query) {

      setSearchResults([]);
      setSearchLoading(false);
      setShowSearchResults(false);

      return;
    }


    // Minimum 2 characters
    if (query.length < 2) {

      setSearchResults([]);
      setSearchLoading(false);
      setShowSearchResults(false);

      return;
    }


    // =======================================================
    // DEBOUNCE
    // =======================================================

    const timer = setTimeout(async () => {

      try {

        setSearchLoading(true);
        setShowSearchResults(true);


        // Same API used by Navbar
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


        // Only first 3 products
        setSearchResults(
          results.slice(0, 3)
        );


      } catch (error) {

        console.error(
          "Hero product search error:",
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

  }, [search]);


  // =========================================================
  // GET PRODUCT IMAGE
  // =========================================================

  const getProductImage = (product) => {

    if (!product) {
      return null;
    }


    // Images array
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


    // Close dropdown
    setShowSearchResults(false);


    // Clear search
    setSearch("");


    // Go directly to product detail
    navigate(`/products/${product.id}`);

  };


  // =========================================================
  // SEARCH FOCUS
  // =========================================================

  const handleSearchFocus = () => {

    if (
      search.trim() &&
      searchResults.length > 0
    ) {

      setShowSearchResults(true);

    }

  };


  // =========================================================
  // SEARCH SUBMIT
  // =========================================================

  const handleSearchSubmit = (e) => {

    e.preventDefault();


    const query = search.trim();


    // Don't do anything for empty search
    if (!query) {
      return;
    }


    // If there are results,
    // keep showing the dropdown.
    if (searchResults.length > 0) {

      setShowSearchResults(true);

      return;

    }

  };


  return (

    <section
      className="
        bg-[#F8FAFC]
        min-h-screen
        flex
        items-center
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          lg:px-10
          py-20
          w-full
        "
      >

        <div
          className="
            grid
            lg:grid-cols-2
            gap-16
            items-center
          "
        >


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>


            {/* Badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-blue-100
                text-blue-600
                font-medium
              "
            >

              <Sparkles size={17} />

              AI Powered Quick Commerce

            </div>


            {/* Heading */}

            <h1
              className="
                mt-6
                text-5xl
                lg:text-7xl
                font-bold
                leading-tight
                text-[#0F172A]
              "
            >

              Get Anything

              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-blue-600
                  to-purple-600
                  bg-clip-text
                  text-transparent
                "
              >

                Delivered In Minutes

              </span>

            </h1>


            {/* Description */}

            <p
              className="
                mt-6
                text-xl
                text-gray-600
                max-w-xl
              "
            >

              Shop groceries, electronics and daily essentials with
              AI-powered recommendations and lightning-fast delivery.

            </p>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div
              className="
                mt-8
                flex
                flex-col
                sm:flex-row
                gap-4
              "
            >

              {/* SHOP NOW */}

              <Link
                to="/products"
                className="
                  bg-[#2563EB]
                  text-white
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  hover:scale-105
                  hover:bg-blue-700
                  transition
                  duration-200
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                Shop Now

                <ArrowRight size={19} />

              </Link>


              {/* EXPLORE PRODUCTS */}

              <Link
                to="/category"
                className="
                  border
                  border-gray-300
                  bg-white/50
                  px-8
                  py-4
                  rounded-xl
                  font-semibold
                  text-[#0F172A]
                  hover:bg-white
                  hover:border-blue-300
                  hover:text-blue-600
                  transition
                  duration-200
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                Explore Products

                <ArrowRight size={19} />

              </Link>

            </div>


            {/* =================================================
                HERO SEARCH
            ================================================= */}

            <div className="relative mt-10">


              <form
                onSubmit={handleSearchSubmit}
                className="
                  bg-white
                  p-3
                  rounded-2xl
                  shadow-lg
                  border
                  border-gray-100
                  flex
                  items-center
                  gap-2
                  w-full
                  max-w-2xl
                "
              >

                <Search
                  size={22}
                  className="
                    text-gray-400
                    ml-2
                    shrink-0
                  "
                />


                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  onFocus={handleSearchFocus}
                  placeholder="
                    Search groceries, electronics, brands...
                  "
                  className="
                    flex-1
                    outline-none
                    px-3
                    py-2
                    text-gray-700
                    bg-transparent
                    min-w-0
                  "
                />


                {/* Loading */}

                {searchLoading && (

                  <span
                    className="
                      text-xs
                      text-gray-400
                      whitespace-nowrap
                    "
                  >

                    Searching...

                  </span>

                )}


                <button
                  type="submit"
                  className="
                    bg-[#2563EB]
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    hover:bg-blue-700
                    transition
                    shrink-0
                  "
                >

                  Search

                </button>

              </form>


              {/* =================================================
                  SEARCH RESULTS DROPDOWN
              ================================================= */}

              {showSearchResults &&
                search.trim() && (

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
                    max-w-2xl
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


                    /* =================================================
                       RESULTS
                    ================================================= */

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
                                handleProductClick(product)
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


                    /* =================================================
                       NO RESULTS
                    ================================================= */

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


            {/* Search Hint */}

            <p
              className="
                mt-3
                text-sm
                text-gray-400
              "
            >

              Try searching for

              <span
                className="
                  font-medium
                  text-gray-500
                "
              >

                {" "}Milk, Laptop, Headphones or Beauty

              </span>

            </p>

          </div>


          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div
            className="
              flex
              justify-center
            "
          >

            <div
              className="
                bg-white
                rounded-3xl
                shadow-2xl
                p-8
                w-full
                max-w-md
                border
                border-gray-100
              "
            >


              {/* AI CARD HEADER */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-6
                "
              >

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    flex
                    items-center
                    justify-center
                    text-white
                    text-xl
                  "
                >

                  🤖

                </div>


                <div>

                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-[#1E293B]
                    "
                  >

                    AI Shopping Assistant

                  </h3>

                  <p
                    className="
                      text-sm
                      text-gray-400
                    "
                  >

                    Smart recommendations for you

                  </p>

                </div>

              </div>


              {/* RECOMMENDATIONS */}

              <div
                className="
                  border-b
                  pb-5
                "
              >

                <h4
                  className="
                    font-semibold
                    mb-4
                    text-[#1E293B]
                  "
                >

                  Recommended For You

                </h4>


                <div className="space-y-3">


                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      p-3
                      rounded-xl
                      bg-gray-50
                    "
                  >

                    <span>
                      🥛 Milk
                    </span>

                    <span
                      className="
                        text-green-600
                        font-semibold
                      "
                    >
                      98%
                    </span>

                  </div>


                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      p-3
                      rounded-xl
                      bg-gray-50
                    "
                  >

                    <span>
                      🍎 Apples
                    </span>

                    <span
                      className="
                        text-green-600
                        font-semibold
                      "
                    >
                      96%
                    </span>

                  </div>


                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      p-3
                      rounded-xl
                      bg-gray-50
                    "
                  >

                    <span>
                      🍞 Bread
                    </span>

                    <span
                      className="
                        text-green-600
                        font-semibold
                      "
                    >
                      95%
                    </span>

                  </div>

                </div>

              </div>


              {/* DELIVERY */}

              <div
                className="
                  py-5
                  border-b
                "
              >

                <h4
                  className="
                    font-semibold
                    mb-2
                    text-[#1E293B]
                  "
                >

                  Delivery ETA

                </h4>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <p
                    className="
                      text-4xl
                      font-bold
                      text-[#2563EB]
                    "
                  >

                    12 min

                  </p>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-100
                      text-green-600
                      text-sm
                      font-semibold
                    "
                  >

                    Fast

                  </span>

                </div>

              </div>


              {/* CART */}

              <div className="pt-5">

                <h4
                  className="
                    font-semibold
                    mb-2
                    text-[#1E293B]
                  "
                >

                  Cart Value

                </h4>

                <p
                  className="
                    text-3xl
                    font-bold
                    text-[#16A34A]
                  "
                >

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