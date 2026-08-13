const RiderDashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">

      {/* Dashboard Title */}

      <div className="h-10 w-72 bg-gray-200 rounded mb-8"></div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl shadow p-6"
          >
            <div className="h-5 w-24 bg-gray-200 rounded"></div>

            <div className="h-10 w-16 bg-gray-200 rounded mt-5"></div>
          </div>
        ))}

      </div>

      {/* Order Cards */}

      <div className="mt-10 space-y-6">

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl shadow p-6"
          >

            <div className="flex justify-between">

              <div className="space-y-4">

                <div className="h-6 w-44 bg-gray-200 rounded"></div>

                <div className="h-4 w-36 bg-gray-200 rounded"></div>

                <div className="h-4 w-28 bg-gray-200 rounded"></div>

                <div className="h-4 w-20 bg-gray-200 rounded"></div>

              </div>

              <div className="h-8 w-24 bg-gray-200 rounded-full"></div>

            </div>

            <div className="mt-6 h-12 bg-gray-200 rounded-xl"></div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default RiderDashboardSkeleton;