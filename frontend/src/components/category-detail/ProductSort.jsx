const ProductSort = ({ value, onChange }) => {
  return (
    <div className="flex justify-end my-6">

      <select
        value={value}
        onChange={onChange}
        className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 bg-white"
      >
        <option value="default">
          Sort By
        </option>

        <option value="newest">
          Newest
        </option>

        <option value="price_low">
          Price: Low to High
        </option>

        <option value="price_high">
          Price: High to Low
        </option>

        <option value="rating">
          Highest Rated
        </option>

        <option value="discount">
          Highest Discount
        </option>

      </select>

    </div>
  );
};

export default ProductSort;