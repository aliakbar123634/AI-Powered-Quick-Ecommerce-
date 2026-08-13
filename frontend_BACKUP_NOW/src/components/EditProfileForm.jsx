import React from "react";

const EditProfileForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleCancel,
  loading,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-12">

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8"
      >

        <h2 className="text-2xl font-bold mb-8">
          Personal Information
        </h2>

        {/* Profile Image */}

        <div className="flex flex-col items-center mb-10">

          {formData.profile_image ? (

            <img
              src={
                typeof formData.profile_image === "string"
                  ? formData.profile_image
                  : URL.createObjectURL(formData.profile_image)
              }
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-green-500"
            />

          ) : (

            <div className="w-36 h-36 rounded-full bg-slate-200 flex items-center justify-center text-5xl font-bold text-slate-600">
              {formData.name
                ? formData.name.charAt(0).toUpperCase()
                : "U"}
            </div>

          )}

          <input
            type="file"
            name="profile_image"
            accept="image/*"
            onChange={handleChange}
            className="mt-6"
          />

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Name */}

          <div>

            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* Phone */}

          <div>

            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* Date of Birth */}

          <div>

            <label className="block mb-2 font-medium">
              Date of Birth
            </label>

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* Email */}

          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full border rounded-xl p-4 bg-gray-100 cursor-not-allowed"
            />

          </div>

        </div>

        {/* Bio */}

        <div className="mt-8">

          <label className="block mb-2 font-medium">
            Bio
          </label>

          <textarea
            rows="5"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4 mt-10">

          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditProfileForm;