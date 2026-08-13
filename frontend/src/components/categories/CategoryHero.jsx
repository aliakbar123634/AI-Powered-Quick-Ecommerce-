import { Search } from "lucide-react";

const CategoryHero = () => {
  return (
    <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-3xl overflow-hidden">

      <div className="max-w-7xl mx-auto px-8 py-16">

        <div className="max-w-3xl">

          <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium">

            🛍️ Browse Categories

          </span>

          <h1 className="text-5xl font-bold mt-6 leading-tight">

            Explore Our

            <br />

            Product Categories

          </h1>

          <p className="text-lg text-green-100 mt-5 leading-8">

            Discover thousands of products organized into
            different categories. Quickly find exactly
            what you're looking for.

          </p>

          {/* Search */}

          <div className="mt-8 relative max-w-xl">

            <Search
              size={22}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search categories..."
              className="w-full h-14 rounded-full pl-14 pr-5 text-gray-700 bg-white outline-none focus:ring-4 focus:ring-green-300"
            />

          </div>

        </div>

      </div>

    </section>
  );
};

export default CategoryHero;