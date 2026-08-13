
import ProductsGrid from "./ProductsGrid";

const FeaturedProducts = () => {
  return (
    <section className="w-full px-10 py-10">

      <div className="flex justify-between items-center mb-10">

        <div>
          <div className="flex items-center gap-3">

            <h2 className="text-5xl font-bold">
              Featured Products
            </h2>

            <span className="rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600">
              Trending
            </span>

          </div>

          <p className="text-gray-500 mt-3">
            HandPick Products recommended for you
          </p>

        </div>

        <button className="text-[#2563EB] font-semibold hover:underline">
          View All →
        </button>

      </div>

      <ProductsGrid limit={8} />

    </section>
  );
};

export default FeaturedProducts;