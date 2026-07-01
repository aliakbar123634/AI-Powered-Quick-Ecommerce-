import React from "react";

const CheckoutAddress = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-8">

      <h2 className="text-2xl font-bold mb-6">
        Shipping Address
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Full Name */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name
          </label>

          <input
            type="text"
            placeholder="John Doe"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Email */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="john@example.com"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Phone */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Phone Number
          </label>

          <input
            type="text"
            placeholder="+92 300 1234567"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* City */}

        <div>
          <label className="block text-sm font-medium mb-2">
            City
          </label>

          <input
            type="text"
            placeholder="Lahore"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

      </div>

      {/* Address */}

      <div className="mt-6">

        <label className="block text-sm font-medium mb-2">
          Street Address
        </label>

        <textarea
          rows={4}
          placeholder="House No, Street, Area..."
          className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-green-500"
        />

      </div>

      {/* Postal + Country */}

      <div className="grid md:grid-cols-2 gap-6 mt-6">

        <div>
          <label className="block text-sm font-medium mb-2">
            Postal Code
          </label>

          <input
            type="text"
            placeholder="54000"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Country
          </label>

          <input
            type="text"
            placeholder="Pakistan"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

      </div>

    </div>
  );
};

export default CheckoutAddress;