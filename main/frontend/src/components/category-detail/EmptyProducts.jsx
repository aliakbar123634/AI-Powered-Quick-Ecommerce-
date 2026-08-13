import { PackageSearch } from "lucide-react";

const EmptyProducts = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 border rounded-3xl bg-gray-50 mt-10">

      <PackageSearch
        size={70}
        className="text-gray-400"
      />

      <h2 className="text-2xl font-bold mt-6">
        No Products Found
      </h2>

      <p className="text-gray-500 mt-3 text-center max-w-md">
        We couldn't find any products matching your filters.
        Try changing the search or removing some filters.
      </p>

    </div>
  );
};

export default EmptyProducts;