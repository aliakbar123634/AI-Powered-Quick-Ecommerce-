import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { addToCart } from "../api/orderApi";
import { Heart, Star, ShoppingCart } from "lucide-react";

const ProductsGrid = ({
  limit,
  search,
  ordering,
  setTotalProducts,
  selectedCategory,
  stockStatus,
  viewMode,
  minPrice,
  maxPrice,
  rating,
  discount,
}) => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [page, setPage] = useState(1);
  const sectionRef = useRef(null);


  useEffect(() => {

  setLoading(true);

  const fetchProducts = async () => {
    try {
      console.log("SEARCH VALUE:", search);
      const data = await getProducts(
        page,
        search,
        ordering,
        selectedCategory,
        stockStatus,
        minPrice,
        maxPrice,
        rating,
        discount
      );

      setProduct(data.data.results);
      setTotalProducts?.(data.data.count);

      setNext(data.data.next);
      setPrevious(data.data.previous);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();

}, [
  page,
  search,
  ordering,
  selectedCategory,
  stockStatus,
  minPrice,
  maxPrice,
  rating,
  discount,
]);
const handleAddToCart = async (productId) => {

    try {

        const response = await addToCart({
            product: productId,
            quantity: 1,
        });

        console.log(response.data);

        alert("Product Added Successfully");

    } catch (error) {

        console.log(error.response?.data);

        alert("Unable to add product");

    }

};

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }


  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-6"
        }
      >
        {product.slice(0, limit || product.length).map((pro) => (
          <div
            key={pro.id}
            className={
              viewMode === "grid"
                ? `
                group
                bg-white
                rounded-3xl
                overflow-hidden
                border
                border-gray-200
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-500
              `
                : `
                flex
                flex-col
                md:flex-row
                bg-white
                rounded-3xl
                overflow-hidden
                border
                border-gray-200
                hover:shadow-xl
                transition-all
              `
            }
          >
            {/* Image */}
            <div
              className={
                viewMode === "grid"
                  ? "relative overflow-hidden"
                  : "relative overflow-hidden md:w-80 flex-shrink-0"
              }
            >
              <Link to={`/products/${pro.id}`}>
                <img
                  src={pro.image}
                  alt={pro.name}
                  className={
                    viewMode === "grid"
                      ? `
                        w-full
                        h-56
                        sm:h-64
                        object-cover
                        group-hover:scale-105
                        transition-transform
                        duration-500
                      `
                      : `
                        w-full
                        h-60
                        sm:h-72
                        md:h-75
                        object-cover
                      `
                  }
                />
              </Link>

              {pro.off > 0 && (
                <div
                  className="
                    absolute
                    top-3
                    left-3
                    bg-red-500
                    text-white
                    text-xs
                    sm:text-sm
                    font-semibold
                    px-3
                    py-2
                    rounded-full
                  "
                >
                  {pro.off}% OFF
                </div>
              )}

              <button
                className="
                  absolute
                  top-3
                  right-3
                  bg-white
                  p-2.5
                  rounded-full
                  shadow-lg
                  hover:bg-red-500
                  hover:text-white
                  transition-all
                "
              >
                <Heart size={18} />
              </button>
            </div>

            {/* Content Starts */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">
                            <p className="text-sm font-medium text-blue-600">
                {pro.category_name}
              </p>

              <h3
                className="
                  mt-2
                  text-lg
                  sm:text-xl
                  font-bold
                  text-slate-900
                  line-clamp-2
                "
              >
                {pro.name}
              </h3>

              {/* Rating */}

              <div className="flex flex-wrap items-center gap-2 mt-3">

                <Star
                  size={18}
                  fill="#F59E0B"
                  stroke="#F59E0B"
                />

                <span className="font-semibold">
                  {pro.average_rating || 0}
                </span>

                <span className="text-gray-500 text-sm">
                  ({pro.reviews_count} Reviews)
                </span>

              </div>

              {/* Stock */}

              <div className="mt-3">

                <span
                  className={`text-sm font-medium ${
                    pro.stock_status
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  ● {pro.stock_status ? "In Stock" : "Out Of Stock"}
                </span>

              </div>

              {/* Price */}

              <div className="flex flex-wrap items-center gap-3 mt-4">

                <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                  ${pro.discount_price}
                </span>

                {Number(pro.discount_price) < Number(pro.price) && (
                  <span className="text-gray-400 line-through text-base sm:text-lg">
                    ${pro.price}
                  </span>
                )}

              </div>

              {/* Button */}




              <button
                onClick={() => handleAddToCart(pro.id)}
                className="
                mt-6
                w-full
              bg-green-600
              hover:bg-green-700
              text-white
                py-3
                rounded-xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                duration-300
                "
              >
            <ShoppingCart size={18} />
              Add To Cart
            </button>

            </div>

          </div>

        ))}

      </div>

      {/* Pagination */}

      <div className="flex flex-wrap justify-center items-center gap-3 mt-12">

        <button
          disabled={!previous}

          onClick={() => {
            if (previous) {
            setPage((prev) => prev - 1);

            setTimeout(() => {
             sectionRef.current?.scrollIntoView({
             behavior: "smooth",
             block: "start",
            });
            }, 100);
           }
          }}
        className={`
          px-5
          sm:px-6
          py-2.5
          sm:py-3
          rounded-xl
          text-sm
          sm:text-base
          font-semibold
          transition-all
         ${
         previous
            ? "bg-slate-900 text-white hover:bg-slate-800"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }
        `}

        >
          ← Previous
        </button>

        <div
          className="
            px-5
            py-3
            rounded-xl
            bg-blue-50
            border
            border-blue-200
          "
        >
          <span className="font-bold text-blue-600">
            Page {page}
          </span>
        </div>

        <button
          disabled={!next}


        onClick={() => {
          if (next) {
          setPage((prev) => prev + 1);

          setTimeout(() => {
            sectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
         }, 100);
        }
      }}
  className={`
    px-5
    sm:px-6
    py-2.5
    sm:py-3
    rounded-xl
    text-sm
    sm:text-base
    font-semibold
    transition-all
    ${
      next
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-slate-200 text-slate-400 cursor-not-allowed"
    }
  `}
>
      
        
          Next →
        </button>

      </div>

    </section>
  );
};

export default ProductsGrid;
