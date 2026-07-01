import React from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  MapPin,
  LogOut,
} from "lucide-react";

const ProfileActions = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mt-8">

      <h2 className="text-2xl font-bold mb-8">
        Account Actions
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        {/* Edit Profile */}

        <button
          onClick={() => navigate("/profile/edit")}
          className="flex items-center gap-4 p-5 rounded-2xl border hover:border-green-600 hover:bg-green-50 transition"
        >
          <User className="text-green-600" />
          <div className="text-left">
            <h3 className="font-semibold">
              Edit Profile
            </h3>
            <p className="text-sm text-gray-500">
              Update your personal information
            </p>
          </div>
        </button>

        {/* Change Password */}

        <button
          onClick={() => navigate("/change-password")}
          className="flex items-center gap-4 p-5 rounded-2xl border hover:border-blue-600 hover:bg-blue-50 transition"
        >
          <Lock className="text-blue-600" />
          <div className="text-left">
            <h3 className="font-semibold">
              Change Password
            </h3>
            <p className="text-sm text-gray-500">
              Update your account password
            </p>
          </div>
        </button>

        {/* Manage Addresses */}

        <button
          onClick={() => navigate("/addresses")}
          className="flex items-center gap-4 p-5 rounded-2xl border hover:border-yellow-600 hover:bg-yellow-50 transition"
        >
          <MapPin className="text-yellow-600" />
          <div className="text-left">
            <h3 className="font-semibold">
              Manage Addresses
            </h3>
            <p className="text-sm text-gray-500">
              Add or edit your addresses
            </p>
          </div>
        </button>

        {/* Logout */}

        <button
          onClick={onLogout}
          className="flex items-center gap-4 p-5 rounded-2xl border hover:border-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="text-red-600" />
          <div className="text-left">
            <h3 className="font-semibold">
              Logout
            </h3>
            <p className="text-sm text-gray-500">
              Sign out from your account
            </p>
          </div>
        </button>

      </div>

    </div>
  );
};

export default ProfileActions;