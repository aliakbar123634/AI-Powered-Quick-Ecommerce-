import { Search } from "lucide-react";

const CategorySearch = ({ value, onChange }) => {
  return (
    <div className="mt-10">

      <div className="relative max-w-xl mx-auto">

        <Search
          size={22}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search category..."
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>

    </div>
  );
};

export default CategorySearch;