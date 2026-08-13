import { Search } from "lucide-react";

const ProductSearch = ({ value, onChange }) => {
  return (
    <div className="my-10">

      <div className="relative max-w-xl">

        <Search
          size={22}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search products..."
          value={value}
          onChange={onChange}
          className="w-full border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500 transition"
        />

      </div>

    </div>
  );
};

export default ProductSearch;