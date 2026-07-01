// 














import React from "react";

const UserProfileCard = ({ user }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">

      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* Profile Avatar */}
        <div className="flex-shrink-0">

          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt={user?.name}
              className="w-36 h-36 rounded-full object-cover border-4 border-green-500"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-slate-200 flex items-center justify-center text-5xl font-bold text-slate-600">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>
          )}

        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">

          <h2 className="text-3xl font-bold text-slate-900">
            {user?.name || "No Name"}
          </h2>

          <p className="text-gray-500 mt-2">
            {user?.email}
          </p>

          <div className="mt-5">
            <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              {user?.role}
            </span>
          </div>

        </div>

        {/* Button */}
        <div>
          <button
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-8
              py-3
              rounded-2xl
              font-semibold
              transition
            "
          >
            Edit Profile
          </button>
        </div>

      </div>

    </div>
  );
};

export default UserProfileCard;