const ActiveFilters = ({
    totalProducts,
    filteredCount,

    search,
    setSearch,

    selectedPrice,
    setSelectedPrice,

    stockFilter,
    setStockFilter,
}) => {

    return (

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mt-8">

            {/* Product Count */}

            <div>

                <h3 className="text-xl font-semibold">

                    Showing

                    <span className="text-green-600 mx-2">
                        {filteredCount}
                    </span>

                    of

                    <span className="text-green-600 mx-2">
                        {totalProducts}
                    </span>

                    Products

                </h3>

            </div>

            {/* Active Filters */}

            <div className="flex flex-wrap gap-3">

                {search && (

                    <button
                        onClick={() => setSearch("")}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                    >

                        Search : {search} ✕

                    </button>

                )}

                {selectedPrice !== "all" && (

                    <button
                        onClick={() => setSelectedPrice("all")}
                        className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full"
                    >

                        Price : {selectedPrice} ✕

                    </button>

                )}

                {stockFilter !== "all" && (

                    <button
                        onClick={() => setStockFilter("all")}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-full"
                    >

                        Stock : {stockFilter} ✕

                    </button>

                )}

            </div>

        </div>

    );

};

export default ActiveFilters;