const StockFilter = ({
    stockFilter,
    onChange,
}) => {

    return (

        <div className="flex flex-wrap gap-3 my-8">

            <button
                onClick={() => onChange("all")}
                className={`px-5 py-3 rounded-full border transition

                ${
                    stockFilter === "all"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white hover:bg-gray-100"
                }`}
            >
                All
            </button>

            <button
                onClick={() => onChange("in_stock")}
                className={`px-5 py-3 rounded-full border transition

                ${
                    stockFilter === "in_stock"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white hover:bg-gray-100"
                }`}
            >
                In Stock
            </button>

            <button
                onClick={() => onChange("out_stock")}
                className={`px-5 py-3 rounded-full border transition

                ${
                    stockFilter === "out_stock"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white hover:bg-gray-100"
                }`}
            >
                Out Of Stock
            </button>

        </div>

    );

};

export default StockFilter;