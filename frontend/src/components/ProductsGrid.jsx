// import React from "react";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getProducts } from "../api/productApi";
// import {
//   Heart,
//   Star,
//   ShoppingCart,
// } from "lucide-react";

// const ProductsGrid = ({
//   limit,
//   search,
//   ordering,
//   setTotalProducts,
//   selectedCategory,
//   stockStatus,
//   viewMode,
//   minPrice,
//   maxPrice,
//   rating,
//   discount
// }) => {
//   const [product, setproduct] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // const [next, setNext] = useState(null);
//   // const [previous, setPrevious] = useState(null);
//   // const [page, setPage] = useState(1);

//   // useEffect(() => {
//   //   const getproduct = async () => {
//   //     try {
//   //       const data = await getProducts(page , search, ordering , selectedCategory, stockStatus ,   minPrice, maxPrice , rating , discount) ;
//   //       console.log("API Response:", data);
//   //       setproduct(data.data.results);
//   //       setTotalProducts(data.data.count);
//   //       setNext(data.data.next);
//   //       setPrevious(data.data.previous);
//   //     } catch (error) {
//   //       console.log("Error fetching products:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   getproduct();
//   // }, [page , search, ordering ,   selectedCategory, stockStatus,  minPrice, maxPrice , rating , discount]);

// useEffect(() => {
//   if (!product) return;

//   const fetchRelatedProducts = async () => {
//     try {
//       const data = await getProducts(
//         1,
//         "",
//         "",
//         product.category
//       );

//       const related = data.data.results
//         .filter((item) => item.id !== product.id)
//         .slice(0, 4);

//       setProducts(related);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchRelatedProducts();
// }, [product]);  

//   if (loading) return <h3>Loading...</h3>;

// return (
//   <section className="max-w-7xl mx-auto px-6 py-12">


//       <div
//   className={
//     viewMode === "grid"
//       ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
//       : "flex flex-col gap-6"
//   }
// >

//       {product.slice(0, limit || product.length).map((pro) => (
//         <div
//   key={pro.id}
//   className={
//     viewMode === "grid"
//       ? `
//         group
//         bg-white
//         rounded-3xl
//         overflow-hidden
//         border
//         border-gray-200
//         hover:shadow-2xl
//         hover:-translate-y-2
//         transition-all
//         duration-500
//       `
//       : `
//         flex
//         bg-white
//         rounded-3xl
//         overflow-hidden
//         border
//         border-gray-200
//         hover:shadow-xl
//         transition-all
//       `
//   }
// >

//           {/* Image */}

//           <div className="relative overflow-hidden">

//             <Link to={`/products/${pro.id}`}>

//               <img
//                 src={pro.image}
//                 alt={pro.name}
//                 className={
//                   viewMode === "grid"
//       ? "w-full h-64 object-cover"
//       : "w-72 h-72 object-cover"
//   }
//               />

//             </Link>

//             {pro.off > 0 && (
//               <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-semibold">
//                 {pro.off}% OFF
//               </div>
//             )}

//             <button

//             className=" absolute  top-4   right-4  bg-white  p-3  rounded-full  shadow-lg  hover:bg-red-500  hover:text-white  transition-all  duration-300  ">
//               <Heart size={18}  />
//             </button>

//           </div>

//           {/* Content */}

//           <div className="p-5">

//             <p className="text-sm text-blue-600 font-medium">
//               {pro.category_name}
//             </p>

//             <h3
//               className="
//               mt-2
//               text-xl
//               font-bold
//               text-slate-900
//               line-clamp-2
//               min-h-[56px]
//               "
//             >
//               {pro.name}
//             </h3>

//             {/* Rating */}

//             <div className="flex items-center gap-2 mt-3">

//               <Star
//                 size={18}
//                 fill="#F59E0B"
//                 stroke="#F59E0B"
//               />

//               <span className="font-semibold">
//                 {pro.average_rating || 0}
//               </span>

//               <span className="text-gray-400">
//                 ({pro.reviews_count} Reviews)
//               </span>

//             </div>

//             {/* Stock */}

//             <div className="mt-3 flex justify-between">

//               <span
//                 className={`text-sm font-medium ${
//                   pro.stock_status
//                     ? "text-green-600"
//                     : "text-red-500"
//                 }`}
//               >
//                 ● {pro.stock_status ? "In Stock" : "Out Of Stock"}
//               </span>

//             </div>

//             {/* Price */}

//             <div className="flex items-center gap-3 mt-4">

//               <span className="text-3xl font-bold text-slate-900">
//                 ${pro.discount_price}
//               </span>

//               {Number(pro.discount_price) <
//                 Number(pro.price) && (
//                 <span className="text-gray-400 line-through">
//                   ${pro.price}
//                 </span>
//               )}

//             </div>

//             {/* Button */}

//             <button
//               className="
//               mt-6
//               w-full
//               bg-green-600
//               hover:bg-green-700
//               text-white
//               py-3
//               rounded-xl
//               font-semibold
//               flex
//               items-center
//               justify-center
//               gap-2
//               transition-all
//               "
//             >
//               <ShoppingCart size={18} />
//               Add To Cart
//             </button>

//           </div>

//         </div>
        

//       ))}
      

//     </div>

//   <div className="flex justify-center items-center gap-4 mt-12">

//   <button
//     disabled={!previous}
//     onClick={() => {
//       if (previous) {
//         setPage((prev) => prev - 1);
//       }
//     }}
//     className={`
//       px-6 py-3 rounded-xl font-semibold transition-all
//       ${
//         previous
//           ? "bg-slate-900 text-white hover:bg-slate-800"
//           : "bg-slate-200 text-slate-400 cursor-not-allowed"
//       }
//     `}
//   >
//     ← Previous
//   </button>

//   <div className="px-5 py-3 rounded-xl bg-blue-50 border border-blue-200">
//     <span className="font-bold text-blue-600">
//       Page {page}
//     </span>
//   </div>

//   <button
//     disabled={!next}
//     onClick={() => {
//       if (next) {
//         setPage((prev) => prev + 1);
//       }
//     }}
//     className={`
//       px-6 py-3 rounded-xl font-semibold transition-all
//       ${
//         next
//           ? "bg-blue-600 text-white hover:bg-blue-700"
//           : "bg-slate-200 text-slate-400 cursor-not-allowed"
//       }
//     `}
//   >
//     Next →
//   </button>

//  </div>
    

//   </section>
// );
// };

// export default ProductsGrid;




import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import {
  Heart,
  Star,
  ShoppingCart,
} from "lucide-react";

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

  const [product, setproduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {

    const getproduct = async () => {

      try {

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

        console.log("API Response:", data);

        setproduct(data.data.results);
        setTotalProducts(data.data.count);

        setNext(data.data.next);
        setPrevious(data.data.previous);

      } catch (error) {

        console.log("Error fetching products:", error);

      } finally {

        setLoading(false);

      }

    };

    getproduct();

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

  if (loading) return <h3>Loading...</h3>;

  return (

    <section className="max-w-7xl mx-auto px-6 py-12">

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            : "flex flex-col gap-6"
        }
      >

        {product
          .slice(0, limit || product.length)
          .map((pro) => (
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

              <div className="relative overflow-hidden">

                <Link to={`/products/${pro.id}`}>

                  <img
                    src={pro.image}
                    alt={pro.name}
                    className={
                      viewMode === "grid"
                        ? "w-full h-64 object-cover"
                        : "w-72 h-72 object-cover"
                    }
                  />

                </Link>

                {pro.off > 0 && (

                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-semibold">
                    {pro.off}% OFF
                  </div>

                )}

                <button
                  className="
                  absolute
                  top-4
                  right-4
                  bg-white
                  p-3
                  rounded-full
                  shadow-lg
                  hover:bg-red-500
                  hover:text-white
                  transition-all
                  duration-300
                  "
                >
                  <Heart size={18} />
                </button>

              </div>

              {/* Content */}

              <div className="p-5">

                <p className="text-sm text-blue-600 font-medium">
                  {pro.category_name}
                </p>

                <h3
                  className="
                  mt-2
                  text-xl
                  font-bold
                  text-slate-900
                  line-clamp-2
                  min-h-[56px]
                  "
                >
                  {pro.name}
                </h3>

                {/* Rating */}

                <div className="flex items-center gap-2 mt-3">

                  <Star
                    size={18}
                    fill="#F59E0B"
                    stroke="#F59E0B"
                  />

                  <span className="font-semibold">
                    {pro.average_rating || 0}
                  </span>

                  <span className="text-gray-400">
                    ({pro.reviews_count} Reviews)
                  </span>

                </div>

                {/* Stock */}

                <div className="mt-3 flex justify-between">

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

                <div className="flex items-center gap-3 mt-4">

                  <span className="text-3xl font-bold text-slate-900">
                    ${pro.discount_price}
                  </span>

                  {Number(pro.discount_price) <
                    Number(pro.price) && (

                    <span className="text-gray-400 line-through">
                      ${pro.price}
                    </span>

                  )}

                </div>

                {/* Button */}

                <button
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
                  "
                >
                  <ShoppingCart size={18} />
                  Add To Cart
                </button>

              </div>

            </div>

          ))}

      </div>

      <div className="flex justify-center items-center gap-4 mt-12">

        <button
          disabled={!previous}
          onClick={() => {
            if (previous) {
              setPage((prev) => prev - 1);
            }
          }}
          className={`
            px-6
            py-3
            rounded-xl
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

        <div className="px-5 py-3 rounded-xl bg-blue-50 border border-blue-200">
          <span className="font-bold text-blue-600">
            Page {page}
          </span>
        </div>

        <button
          disabled={!next}
          onClick={() => {
            if (next) {
              setPage((prev) => prev + 1);
            }
          }}
          className={`
            px-6
            py-3
            rounded-xl
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