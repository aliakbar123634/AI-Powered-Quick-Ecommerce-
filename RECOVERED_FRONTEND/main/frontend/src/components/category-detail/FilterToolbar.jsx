import ProductSearch from "./ProductSearch";
import ProductSort from "./ProductSort";
import PriceFilter from "./PriceFilter";
import StockFilter from "./StockFilter";

const FilterToolbar = ({
  search,
  setSearch,
  sortBy,
  setSortBy,
  selectedPrice,
  setSelectedPrice,
  stockFilter,
  setStockFilter,
}) => {
  return (
    <section className="bg-white rounded-3xl border shadow-sm p-6 mt-10">

      {/* Top Row */}

      <div className="grid lg:grid-cols-2 gap-6 items-center">

        <ProductSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex justify-end">

          <ProductSort
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />

        </div>

      </div>

      {/* Bottom Row */}

      <div className="flex flex-wrap justify-between items-center gap-6 mt-6">

        <PriceFilter
          selectedPrice={selectedPrice}
          onSelectPrice={setSelectedPrice}
        />

        <StockFilter
          stockFilter={stockFilter}
          onChange={setStockFilter}
        />

      </div>

    </section>
  );
};

export default FilterToolbar;