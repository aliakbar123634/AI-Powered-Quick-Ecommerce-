import React from "react";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
} from "lucide-react";

const SearchAndSort = ({
  search,
  setSearch,
  ordering,
  setOrdering,
  totalProducts,
  viewMode,
  setViewMode,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">

      <div
        className="
        bg-white
        rounded-3xl
        border
        border-[#E2E8F0]
        shadow-xl
        p-5
        "
      >

        <div className="flex flex-col lg:flex-row gap-4 items-center">

          {/* Search */}

          <div
            className="
            flex
            items-center
            gap-3
            border
            border-[#E2E8F0]
            rounded-2xl
            px-4
            py-3
            flex-1
            w-full
            "
          >
            <Search
              size={20}
              className="text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="
              flex-1
              outline-none
              bg-transparent
              "
            />
          </div>

          {/* Sort */}

          <div
            className="
            flex
            items-center
            gap-3
            border
            border-[#E2E8F0]
            rounded-2xl
            px-4
            py-3
            "
          >
            <SlidersHorizontal
              size={18}
              className="text-gray-500"
            />

            <select
              value={ordering}
              onChange={(e) =>
                setOrdering(e.target.value)
              }
              className="
              outline-none
              bg-transparent
              cursor-pointer
              "
            >
              <option value="">
                Sort By
              </option>

              <option value="discount_price">
                Price: Low to High
              </option>

              <option value="-discount_price">
                Price: High to Low
              </option>

              <option value="-average_rating">
                Highest Rated
              </option>

              <option value="-off_percentage">
                Biggest Discount
              </option>

              <option value="-created_at">
                Newest Products
              </option>

            </select>

          </div>

          {/* Products Count */}

          <div
            className="
            px-4
            py-3
            rounded-xl
            bg-blue-50
            text-blue-600
            font-semibold
            "
          >
            {totalProducts} 
          </div>

          {/* View Buttons */}

          <div className="flex gap-2">

            {/* <button
              className="
              p-3
              rounded-xl
              border
              border-[#E2E8F0]
              hover:bg-[#2563EB]
              hover:text-white
              transition
              "
            >
              <Grid3X3 size={18} />
            </button>

            <button
              className="
              p-3
              rounded-xl
              border
              border-[#E2E8F0]
              hover:bg-[#2563EB]
              hover:text-white
              transition
              "
            >
              <List size={18} />
            </button> */}
  <button
  onClick={() => setViewMode("grid")}
  className={`
    p-3 rounded-xl border
    ${
      viewMode === "grid"
        ? "bg-blue-600 text-white"
        : "border-[#E2E8F0]"
    }
  `}
>
  <Grid3X3 size={18} />
</button>

<button
  onClick={() => setViewMode("list")}
  className={`
    p-3 rounded-xl border
    ${
      viewMode === "list"
        ? "bg-blue-600 text-white"
        : "border-[#E2E8F0]"
    }
  `}
>
  <List size={18} />
</button>          

          </div>

        </div>

      </div>

    </section>
  );
};

export default SearchAndSort;