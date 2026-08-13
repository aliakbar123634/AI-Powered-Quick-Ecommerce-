import { SearchX } from "lucide-react";

const CategoryEmpty = () => {
  return (
    <div className="py-24 text-center">

      <SearchX
        size={70}
        className="mx-auto text-gray-400"
      />

      <h2 className="text-3xl font-bold mt-6">
        No Categories Found
      </h2>

      <p className="text-gray-500 mt-3">
        Try another search or check back later.
      </p>

    </div>
  );
};

export default CategoryEmpty;