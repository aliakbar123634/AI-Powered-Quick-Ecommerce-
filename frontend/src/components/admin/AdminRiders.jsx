

import React, { useEffect, useState } from "react";
import {
  getAdminRiders,
  getAvailableRiders,
} from "../../api/adminApi";

const AdminRiders = () => {
  const [riders, setRiders] = useState([]);
  const [availableRiders, setAvailableRiders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRiders = async () => {
    try {
      setLoading(true);
      setError("");

      const [ridersResponse, availableResponse] =
        await Promise.all([
          getAdminRiders(),
          getAvailableRiders(),
        ]);

      const ridersData = ridersResponse.data;
      const availableData = availableResponse.data;

      setRiders(
        ridersData.results || ridersData || []
      );

      setAvailableRiders(
        availableData.results || availableData || []
      );

    } catch (error) {
      console.error("Admin riders error:", error);

      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to load riders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const getAvailabilityStyle = (available) => {
    if (available) {
      return {
        badge:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dot: "bg-emerald-500",
        text: "Available",
      };
    }

    return {
      badge:
        "bg-slate-100 text-slate-600 border border-slate-200",
      dot: "bg-slate-400",
      text: "Unavailable",
    };
  };

  const getVehicleLabel = (vehicle) => {
    if (!vehicle) return "—";

    switch (vehicle) {
      case "BIKE":
        return "Bike";

      case "CYCLE":
        return "Cycle";

      case "CAR":
        return "Car";

      default:
        return vehicle;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />

          <div className="h-4 w-72 bg-slate-200 rounded mt-3 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-4 w-24 bg-slate-200 rounded" />

              <div className="h-8 w-16 bg-slate-200 rounded mt-3" />
            </div>
          ))}

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl h-80 animate-pulse" />

      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Riders
          </h1>

          <p className="text-slate-500 mt-2">
            Manage riders and their availability.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              !
            </div>

            <div>
              <h3 className="font-semibold text-red-800">
                Failed to load riders
              </h3>

              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>
            </div>

          </div>

          <button
            onClick={fetchRiders}
            className="
              mt-5
              px-5
              py-2.5
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              text-white
              text-sm
              font-semibold
              hover:from-blue-700
              hover:to-purple-700
              transition
              shadow-md
              shadow-blue-500/20
            "
          >
            Retry
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Delivery Management
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Riders
          </h1>

          <p className="text-slate-500 mt-2">
            Manage riders, availability and delivery workforce.
          </p>

        </div>

        <button
          onClick={fetchRiders}
          className="
            self-start
            px-4
            py-2.5
            rounded-xl
            border
            border-slate-200
            bg-white
            text-slate-700
            text-sm
            font-semibold
            hover:bg-slate-50
            transition
          "
        >
          Refresh
        </button>

      </div>


      {/* =========================
          STATS
      ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Total Riders */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Total Riders
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {riders.length}
              </h2>

            </div>

            <div className="
              w-12
              h-12
              rounded-xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              font-bold
              text-lg
            ">
              R
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-4">
            Registered delivery riders
          </p>

        </div>


        {/* Available */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Available Riders
              </p>

              <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                {availableRiders.length}
              </h2>

            </div>

            <div className="
              w-12
              h-12
              rounded-xl
              bg-emerald-50
              text-emerald-600
              flex
              items-center
              justify-center
              font-bold
              text-lg
            ">
              ✓
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-4">
            Riders currently available
          </p>

        </div>


        {/* Unavailable */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Unavailable Riders
              </p>

              <h2 className="text-3xl font-bold text-slate-700 mt-2">
                {Math.max(
                  riders.length - availableRiders.length,
                  0
                )}
              </h2>

            </div>

            <div className="
              w-12
              h-12
              rounded-xl
              bg-slate-100
              text-slate-600
              flex
              items-center
              justify-center
              font-bold
              text-lg
            ">
              —
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-4">
            Riders currently unavailable
          </p>

        </div>

      </div>


      {/* =========================
          RIDERS TABLE
      ========================= */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Table Header */}

        <div className="
          px-6
          py-5
          border-b
          border-slate-200
          flex
          items-center
          justify-between
        ">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Rider Directory
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              All registered riders
            </p>

          </div>

          <span className="
            px-3
            py-1.5
            rounded-lg
            bg-blue-50
            text-blue-700
            text-xs
            font-semibold
          ">
            {riders.length} Riders
          </span>

        </div>


        {/* Empty State */}

        {riders.length === 0 ? (

          <div className="p-12 text-center">

            <div className="
              mx-auto
              w-14
              h-14
              rounded-2xl
              bg-slate-100
              text-slate-500
              flex
              items-center
              justify-center
              font-bold
              text-xl
            ">
              R
            </div>

            <h3 className="font-semibold text-slate-900 mt-4">
              No riders found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              There are currently no riders registered.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Rider
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Vehicle
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Availability
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Rating
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Location
                  </th>

                </tr>

              </thead>


              <tbody>

                {riders.map((rider) => {

                  const availability =
                    getAvailabilityStyle(
                      rider.availability_status
                    );

                  const hasLocation =
                    rider.current_latitude !== null &&
                    rider.current_latitude !== undefined &&
                    rider.current_longitude !== null &&
                    rider.current_longitude !== undefined;

                  return (

                    <tr
                      key={rider.id}
                      className="
                        border-b
                        border-slate-100
                        last:border-b-0
                        hover:bg-slate-50
                        transition
                      "
                    >

                      {/* Rider */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-gradient-to-br
                            from-blue-600
                            to-purple-600
                            text-white
                            flex
                            items-center
                            justify-center
                            font-bold
                          ">
                            {(rider.rider_name || "R")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {rider.rider_name || "Unknown Rider"}
                            </p>

                            <p className="text-sm text-slate-500">
                              {rider.rider_email || "—"}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Vehicle */}

                      <td className="px-6 py-5">

                        <span className="
                          inline-flex
                          items-center
                          px-3
                          py-1.5
                          rounded-lg
                          bg-slate-100
                          text-slate-700
                          text-xs
                          font-semibold
                        ">
                          {getVehicleLabel(
                            rider.vehicle_type
                          )}
                        </span>

                      </td>


                      {/* Availability */}

                      <td className="px-6 py-5">

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-semibold
                            ${availability.badge}
                          `}
                        >

                          <span
                            className={`
                              w-2
                              h-2
                              rounded-full
                              ${availability.dot}
                            `}
                          />

                          {availability.text}

                        </span>

                      </td>


                      {/* Rating */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <span className="text-amber-500">
                            ★
                          </span>

                          <span className="font-semibold text-slate-900">
                            {rider.rating !== null &&
                            rider.rating !== undefined
                              ? Number(
                                  rider.rating
                                ).toFixed(1)
                              : "0.0"}
                          </span>

                        </div>

                      </td>


                      {/* Location */}

                      <td className="px-6 py-5">

                        {hasLocation ? (

                          <div>

                            <span className="
                              inline-flex
                              items-center
                              px-3
                              py-1.5
                              rounded-lg
                              bg-blue-50
                              text-blue-700
                              text-xs
                              font-medium
                            ">
                              Location Available
                            </span>

                            <p className="text-[11px] text-slate-400 mt-1">
                              {rider.current_latitude},{" "}
                              {rider.current_longitude}
                            </p>

                          </div>

                        ) : (

                          <span className="text-sm text-slate-400">
                            Location unavailable
                          </span>

                        )}

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminRiders;