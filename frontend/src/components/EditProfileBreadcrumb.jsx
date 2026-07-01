import React from "react";
import { Link } from "react-router-dom";

const EditProfileBreadcrumb = () => {
  return (
    <div className="bg-slate-100 border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-6 py-5">

        <div className="flex items-center gap-2 text-sm">

          <Link
            to="/"
            className="text-gray-500 hover:text-green-600 transition"
          >
            Home
          </Link>

          <span className="text-gray-400">/</span>

          <Link
            to="/profile"
            className="text-gray-500 hover:text-green-600 transition"
          >
            My Profile
          </Link>

          <span className="text-gray-400">/</span>

          <span className="font-semibold text-slate-900">
            Edit Profile
          </span>

        </div>

      </div>

    </div>
  );
};

export default EditProfileBreadcrumb;