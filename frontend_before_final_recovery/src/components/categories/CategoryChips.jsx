const CategoryChips = ({
    categories,
    selectedCategory,
    onSelectCategory,
}) => {

    return (

        <div className="flex flex-wrap gap-3 justify-center mt-8">

            <button
                onClick={() => onSelectCategory("All")}
                className={`px-5 py-2 rounded-full font-semibold transition
                ${
                    selectedCategory === "All"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 hover:bg-green-100"
                }`}
            >
                All
            </button>

            {categories.map((category) => (

                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.name)}
                    className={`px-5 py-2 rounded-full font-semibold transition
                    ${
                        selectedCategory === category.name
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 hover:bg-green-100"
                    }`}
                >
                    {category.name}
                </button>

            ))}

        </div>

    );

};

export default CategoryChips;