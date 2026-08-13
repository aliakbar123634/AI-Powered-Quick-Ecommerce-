// import React, { useEffect, useState } from "react";
// import { getProducts } from "../api/productApi";
// import { Link } from "react-router-dom";
// import {
//   Heart,
//   Star,
//   ShoppingCart,
// } from "lucide-react";

// const RelatedProducts = ({ product }) => {

//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//       const fetchRelatedProducts = async () => {

//     try {

//       const data = await getProducts(
//         1,
//         "",
//         "",
//         product.category
//       );

//       const relatedProducts =
//         data.data.results.filter(
//           (item) => item.id !== product.id
//         );

//       setProducts(
//         relatedProducts.slice(0, 4)
//       );

//     } catch (error) {
//       console.log(error);
//     }

//   };

//   if (product) {
//     fetchRelatedProducts();
//   }

//   }, [product]);

//   return (

//     <section>

//       <h2>You May Also Like</h2>

//              <div

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

//     </section>

//   );
// };

// export default RelatedProducts;


















import React, { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { Link } from "react-router-dom";
import {
  Heart,
  Star,
  ShoppingCart,
} from "lucide-react";

const RelatedProducts = ({ product }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // const fetchRelatedProducts = async () => {
    //   try {
    //     const data = await getProducts(
    //       1,
    //       "",
    //       "",
    //       product.category
    //     );

    //     const relatedProducts = data.data.results.filter(
    //       (item) => item.id !== product.id
    //     );
    //     console.log(product.category);
    //     console.log(data.data.results);
    //     setProducts(relatedProducts.slice(0, 4));
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    const fetchRelatedProducts = async () => {
  try {
    // Same Category Products
    const categoryResponse = await getProducts(
      1,
      "",
      "",
      product.category
    );

    let relatedProducts = categoryResponse.data.results.filter(
      (item) => item.id !== product.id
    );

    // Agar same category me kuch nahi mila
    if (relatedProducts.length === 0) {
      const latestResponse = await getProducts();

      relatedProducts = latestResponse.data.results
        .filter((item) => item.id !== product.id)
        .slice(0, 4);
    } else {
      relatedProducts = relatedProducts.slice(0, 4);
    }

    setProducts(relatedProducts);
  } catch (error) {
    console.log(error);
  }
};
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            You May Also Like
          </h2>

          <p className="text-slate-500 mt-2">
            Similar products you might like.
          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {products.map((pro) => (

          <div
            key={pro.id}
            className="
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
            "
          >

            {/* Image */}

            <div className="relative overflow-hidden">

              <Link to={`/products/${pro.id}`}>

                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-full h-64 object-cover"
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

    </section>
  );
};

export default RelatedProducts;