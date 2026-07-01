import React, { useEffect, useState } from "react";
import { getCategories } from "../api/productApi";
import { RotateCcw } from "lucide-react";
// import ReactSlider from "react-slider";

const FiltersSidebar = ({
  selectedCategory,
  setSelectedCategory,
  stockStatus,
  setStockStatus,
  priceRange,
  setPriceRange,
  rating,
  setRating,
  discount,
  setDiscount,
  clearFilters,
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className="
      bg-white
      border
      border-[#E2E8F0]
      rounded-3xl
      p-6
      sticky
      top-24
      "
    >
  <div className="flex items-center justify-between mb-6">

  <h2 className="text-2xl font-bold text-slate-900 ">
    Filters
  </h2>

  <button
    onClick={clearFilters}
    className="
    group
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-full
    bg-gradient-to-r
    from-red-500
    to-pink-500
    text-white
    font-semibold
    shadow-md
    hover:shadow-lg
    hover:scale-105
    transition-all
    duration-300
    "
  >
    <RotateCcw
      size={15}
      className="group-hover:rotate-180 transition-all duration-500"
    />
    Clear
  </button>

</div>



      {/* Categories */}

      <div className="mb-8">
        <h3 className="font-semibold mb-4">
          Categories
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() =>
                setSelectedCategory("")
              }
            />
            All Categories
          </label>

          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2"
            >
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={
                  selectedCategory === String(cat.id)
                }
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value
                  )
                }
              />

              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}

      <div>
        <h3 className="font-semibold mb-4">
          Availability
        </h3>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={stockStatus === "true"}
            onChange={(e) =>
              setStockStatus(
                e.target.checked ? "true" : ""
              )
            }
          />

          In Stock Only
        </label>
      </div>
      <div className="mt-8">

<div className="mt-8">

  <h3 className="font-semibold mb-4">
    Price Range
  </h3>
  <div className="mt-5">

  <input
    type="range"
    min="0"
    max="1000"
    value={priceRange[1]}
    onChange={(e) =>
      setPriceRange([
        priceRange[0],
        Number(e.target.value),
      ])
    }
    className="
      w-full
      h-2
      bg-slate-200
      rounded-full
      appearance-none
      cursor-pointer
    "
  />

  <div className="flex justify-between mt-3">
    <span className="text-slate-500">
      ${priceRange[0]}
    </span>

    <span className="text-slate-500">
      ${priceRange[1]}
    </span>
  </div>

</div>



</div>
</div>
<div className="mt-8">

  <h3 className="font-semibold mb-4">
    Rating
  </h3>

  <div className="space-y-3">

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="rating"
        value=""
        checked={rating === ""}
        onChange={() => setRating("")}
      />
      All Ratings
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="rating"
        value="4"
        checked={rating === "4"}
        onChange={(e) =>
          setRating(e.target.value)
        }
      />
      ⭐ 4+ Stars
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="rating"
        value="3"
        checked={rating === "3"}
        onChange={(e) =>
          setRating(e.target.value)
        }
      />
      ⭐ 3+ Stars
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="rating"
        value="2"
        checked={rating === "2"}
        onChange={(e) =>
          setRating(e.target.value)
        }
      />
      ⭐ 2+ Stars
    </label>

  </div>

</div>
   <div className="mt-8">

  <h3 className="font-semibold mb-4">
    Discount
  </h3>

  <div className="space-y-3">

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="discount"
        value=""
        checked={discount === ""}
        onChange={() => setDiscount("")}
      />
      All Discounts
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="discount"
        value="10"
        checked={discount === "10"}
        onChange={(e) => setDiscount(e.target.value)}
      />
      10%+ OFF
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="discount"
        value="25"
        checked={discount === "25"}
        onChange={(e) => setDiscount(e.target.value)}
      />
      25%+ OFF
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="discount"
        value="50"
        checked={discount === "50"}
        onChange={(e) => setDiscount(e.target.value)}
      />
      50%+ OFF
    </label>

  </div>

</div>
    </div>
  );
};

export default FiltersSidebar;