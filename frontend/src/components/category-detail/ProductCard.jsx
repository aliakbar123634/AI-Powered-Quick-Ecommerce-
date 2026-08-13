import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const image =
    product.image
      ? `http://127.0.0.1:8000${product.image}`
      : "https://placehold.co/600x400?text=No+Image";

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition duration-300">

      {/* Image */}

      <Link to={`/products/${product.id}`}>

        <div className="relative overflow-hidden h-64">

          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />

          {
            product.off > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.off}% OFF
              </span>
            )
          }

          <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-red-100">

            <Heart size={18} />

          </button>

        </div>

      </Link>

      {/* Content */}

      <div className="p-5">

        <p className="text-sm text-gray-500">

          {product.category_name}

        </p>

        <h2 className="text-xl font-bold mt-2 line-clamp-2">

          {product.name}

        </h2>

        <div className="flex items-center gap-2 mt-3">

          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />

          <span className="font-semibold">

            {product.average_rating ?? 0}

          </span>

          <span className="text-gray-500">

            ({product.reviews_count})

          </span>

        </div>

        <div className="flex items-center gap-3 mt-4">

          <span className="text-2xl font-bold text-green-600">

            ${product.discount_price}

          </span>

          <span className="line-through text-gray-400">

            ${product.price}

          </span>

        </div>

        <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl flex justify-center items-center gap-2 transition">

          <ShoppingCart size={20} />

          Add To Cart

        </button>

      </div>

    </div>
  );
};

export default ProductCard;