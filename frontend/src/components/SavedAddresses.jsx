import React from "react";
import { MapPin, CheckCircle } from "lucide-react";

const SavedAddresses = ({ addresses }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 mt-8">

      <div className="flex items-center justify-between mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Saved Addresses
        </h2>

        <button
          className="
            bg-green-600
            hover:bg-green-700
            text-white
            px-5
            py-2
            rounded-xl
            font-medium
            transition
          "
        >
          + Add Address
        </button>

      </div>

      {addresses?.length > 0 ? (

        <div className="grid md:grid-cols-2 gap-6">

          {addresses.map((address) => (

            <div
              key={address.id}
              className="
                border
                rounded-2xl
                p-6
                hover:border-green-500
                transition
              "
            >

              <div className="flex justify-between items-center">

                <h3 className="font-bold text-xl">
                  {address.title}
                </h3>

                {address.is_default && (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <CheckCircle size={16} />
                    Default
                  </span>
                )}

              </div>

              <div className="flex items-start gap-3 mt-5">

                <MapPin
                  className="text-gray-500 mt-1"
                  size={20}
                />

                <div>

                  <p className="font-medium">
                    {address.street}
                  </p>

                  <p className="text-gray-500">
                    {address.area}, {address.city}
                  </p>

                  {address.formatted_address && (
                    <p className="text-sm text-gray-400 mt-2">
                      {address.formatted_address}
                    </p>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="text-center py-14">

          <MapPin
            size={55}
            className="mx-auto text-gray-300"
          />

          <h3 className="mt-5 text-xl font-semibold">
            No Saved Addresses
          </h3>

          <p className="text-gray-500 mt-2">
            You haven't added any address yet.
          </p>

        </div>

      )}

    </div>
  );
};

export default SavedAddresses;