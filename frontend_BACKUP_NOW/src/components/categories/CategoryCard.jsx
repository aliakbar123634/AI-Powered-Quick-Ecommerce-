import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {

  const image = category.image
    ? category.image
    : "https://placehold.co/600x400?text=Category";

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group block"
    >
      <div className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-[500px]">

        {/* Image */}

        <div className="h-56 overflow-hidden">

          <img
            src={image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

        </div>

        {/* Content */}

        <div className="p-6 flex flex-col flex-1">

          {/* Title */}

          <h2 className="text-2xl font-bold line-clamp-2">

            {category.name}

          </h2>

          {/* Description */}

          <p className="text-gray-500 mt-4 line-clamp-3 min-h-[78px]">

            {category.description ||
              "Browse amazing products in this category."}

          </p>

          {/* Bottom */}

          <div className="mt-auto flex items-center justify-between">

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

              {category.products_count} Products

            </span>

            <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-4 transition-all duration-300">

              View

              <ArrowRight size={20} />

            </div>

          </div>

        </div>

      </div>
    </Link>
  );
};

export default CategoryCard;