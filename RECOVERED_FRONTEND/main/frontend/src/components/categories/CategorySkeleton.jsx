const CategorySkeleton = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border shadow-sm animate-pulse">
      <div className="h-56 bg-gray-200"></div>

      <div className="p-6">
        <div className="h-8 w-2/3 bg-gray-200 rounded"></div>

        <div className="mt-4 h-4 bg-gray-200 rounded"></div>
        <div className="mt-2 h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded"></div>

        <div className="flex justify-between items-center mt-8">
          <div className="h-9 w-28 rounded-full bg-gray-200"></div>

          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default CategorySkeleton;