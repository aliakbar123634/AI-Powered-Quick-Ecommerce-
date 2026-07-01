import React from "react";
import { useEffect, useState } from "react";
import { getCategories } from "../api/productApi";
import { Link } from "react-router-dom";

const CategoryCard = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCategories(page);
        setCategory(data.results);
        // setPage(data.results)
        console.log(data);
      } catch (error) {
        console.log("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  if (loading) return <h3 className="text-center py-10">Loading...</h3>;

  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="max-w-7xl mx-auto px-6 ">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-[#0F172A]">
            Discover Categories
          </h2>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Explore thousands of products across multiple categories
            powered by smart AI recommendations.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {category.slice(0, 8).map((item) => (
            <div
              key={item.id}
              className="
              group
              bg-white
              rounded-2xl
              overflow-hidden
              border
              border-[#E2E8F0]
              hover:shadow-2xl
              hover:-translate-y-3
              transition-all
              duration-300
              "
            >

              {/* Image */}
              <div className="relative overflow-hidden">

                <img
                  src={item.image}
                  alt={item.name}
                  className="
                  w-full
                  h-56
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-110
                  "
                />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="
                    bg-white/90
                    backdrop-blur-sm
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    text-[#2563EB]
                    "
                  >
                    🔥 Trending
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">

                <h3 className="text-xl font-bold text-[#0F172A]">
                  {item.name}
                </h3>

                <p
                  className="
                  text-gray-500
                  text-sm
                  mt-3
                  line-clamp-2
                  "
                >
                  {item.description}
                </p>

                {/* Product Count */}
                <p className="mt-4 text-sm font-medium text-[#16A34A]">
                  {item.products_count}
                </p>

                {/* CTA */}
                <button
                  className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-[#2563EB]
                  font-semibold
                  group-hover:gap-3
                  transition-all
                  
                  "
                >
                <Link to={`/category/${item.id}`}>
                     Shop Now →
                </Link>
                  
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default CategoryCard;