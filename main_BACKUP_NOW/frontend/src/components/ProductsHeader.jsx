import {
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProductsHeader = ({ setSearch }) => {
  const tags = [
    "Milk",
    "Electronics",
    "Headphones",
    "Beauty",
    "Books",
    "Laptop",
  ];

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] border-b border-[#E2E8F0]">

      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl" />

      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/"> 
          <span className="hover:text-[#2563EB] cursor-pointer">
            Home
          </span>
          </Link>

          <ChevronRight size={16} />

          <span className="font-semibold text-[#0F172A]">
            Products
          </span>

        </div>

        {/* Badge */}

        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-[#2563EB] font-medium">

          <Sparkles size={16} />

          AI Powered Product Discovery

        </div>

        {/* Heading */}

        <h1 className="mt-5 text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight max-w-4xl">

          Find Products

          <span className="block text-[#2563EB]">
            You'll Actually Love
          </span>

        </h1>

        {/* Description */}

        <p className="mt-4 text-lg text-gray-500 max-w-3xl">

          Discover trending products, exclusive deals and top-rated items.

        </p>

        {/* Popular Tags */}

        <div className="mt-8">

          <p className="text-sm font-medium text-gray-500 mb-3">
            Popular Searches
          </p>

          <div className="flex flex-wrap gap-3">

            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearch(tag)}
                className="
                px-4
                py-2
                rounded-full
                bg-white
                border
                border-[#E2E8F0]
                text-gray-600
                hover:bg-[#2563EB]
                hover:text-white
                hover:border-[#2563EB]
                transition-all
                duration-300
                "
              >
                {tag}
              </button>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
};

export default ProductsHeader;