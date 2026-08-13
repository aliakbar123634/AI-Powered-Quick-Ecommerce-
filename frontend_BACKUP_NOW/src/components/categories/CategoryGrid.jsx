import CategoryCard from "./CategoryCard";

const CategoryGrid = ({ categories }) => {

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mt-10">

      <div className="flex items-center justify-between mb-8">

        <div>

          <h2 className="text-3xl font-bold">
            Shop by Category
          </h2>

          <p className="text-gray-500 mt-2">
            Browse all available product categories.
          </p>

        </div>

        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

          {categories.length} Categories

        </span>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {categories.map((category) => (

          <CategoryCard
            key={category.id}
            category={category}
          />

        ))}

      </div>

    </section>
  );
};

export default CategoryGrid;