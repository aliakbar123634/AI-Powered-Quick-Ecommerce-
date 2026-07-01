import React from "react";
import { Mail, Phone, Calendar, User } from "lucide-react";

const ProfileDetails = ({ user }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mt-8">

      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Name */}

        <div>
          <label className="text-gray-500 text-sm flex items-center gap-2 mb-2">
            <User size={18} />
            Full Name
          </label>

          <div className="border rounded-xl px-4 py-3 bg-gray-50">
            {user?.name || "Not Added"}
          </div>
        </div>

        {/* Email */}

        <div>
          <label className="text-gray-500 text-sm flex items-center gap-2 mb-2">
            <Mail size={18} />
            Email
          </label>

          <div className="border rounded-xl px-4 py-3 bg-gray-50">
            {user?.email}
          </div>
        </div>

        {/* Phone */}

        <div>
          <label className="text-gray-500 text-sm flex items-center gap-2 mb-2">
            <Phone size={18} />
            Phone Number
          </label>

          <div className="border rounded-xl px-4 py-3 bg-gray-50">
            {user?.phone_number || "Not Added"}
          </div>
        </div>

        {/* DOB */}

        <div>
          <label className="text-gray-500 text-sm flex items-center gap-2 mb-2">
            <Calendar size={18} />
            Date of Birth
          </label>

          <div className="border rounded-xl px-4 py-3 bg-gray-50">
            {user?.date_of_birth || "Not Added"}
          </div>
        </div>

        {/* Bio */}

        <div className="md:col-span-2">
          <label className="text-gray-500 text-sm mb-2 block">
            Bio
          </label>

          <div className="border rounded-xl px-4 py-4 bg-gray-50 min-h-[110px]">
            {user?.bio || "No bio available."}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfileDetails;