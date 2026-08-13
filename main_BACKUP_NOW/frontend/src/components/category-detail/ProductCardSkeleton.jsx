const ProductCardSkeleton = () => {
  return (
    <div className="border rounded-3xl overflow-hidden animate-pulse">

      <div className="h-60 bg-gray-200" />

      <div className="p-5 space-y-4">

        <div className="h-4 bg-gray-200 rounded w-1/2" />

        <div className="h-7 bg-gray-200 rounded w-3/4" />

        <div className="h-4 bg-gray-200 rounded w-full" />

        <div className="h-8 bg-gray-200 rounded w-1/3" />

      </div>

    </div>
  );
};

export default ProductCardSkeleton;