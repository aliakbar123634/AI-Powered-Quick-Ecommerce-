import { Package } from "lucide-react";

const CategoryDetailHero = ({ category }) => {
  if (!category) return null;

  return (
    <section className="bg-gradient-to-r from-green-50 to-white rounded-3xl shadow-sm border overflow-hidden">

      <div className="grid lg:grid-cols-2 gap-10 items-center p-8">

        {/* Left */}

        <div>

          <p className="text-green-600 font-semibold uppercase tracking-wider">
            Product Category
          </p>

          <h1 className="text-5xl font-extrabold mt-3 text-gray-900">
            {category.category_name}
          </h1>

          <p className="text-gray-600 mt-6 leading-8 text-lg">
            {category.category_description}
          </p>

          <div className="mt-8 flex items-center gap-3">

            <div className="bg-green-100 text-green-700 rounded-full px-5 py-3 flex items-center gap-2 font-semibold">

              <Package size={20} />

              {category.total_products} Products

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex justify-center">

          <img
            src={category.category_image}
            alt={category.category_name}
            className="w-full max-w-md h-[350px] object-cover rounded-3xl shadow-xl"
          />

        </div>

      </div>

    </section>
  );
};

export default CategoryDetailHero;