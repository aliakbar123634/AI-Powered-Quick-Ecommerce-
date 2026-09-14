import React, { useEffect, useMemo, useState } from "react";
import {
  getAdminUsers,
  makeUserRider,
} from "../../api/adminApi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [showRiderModal, setShowRiderModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [vehicleType, setVehicleType] = useState("BIKE");

  // ============================================================
  // FETCH USERS
  // ============================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminUsers();

      /*
        DRF pagination usually returns:

        {
          count: 10,
          next: null,
          previous: null,
          results: [...]
        }

        But this also supports a direct array response.
      */

      const data = response?.data;

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data?.results)) {
        setUsers(data.results);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ============================================================
  // FILTER USERS
  // ============================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        user?.name?.toLowerCase().includes(searchText) ||
        user?.email?.toLowerCase().includes(searchText) ||
        user?.phone_number?.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === "ALL" ||
        user?.role?.toUpperCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ============================================================
  // STATS
  // ============================================================

  const totalUsers = users.length;

  const totalCustomers = users.filter(
    (user) => user?.role?.toUpperCase() === "CUSTOMER"
  ).length;

  const totalRiders = users.filter(
    (user) => user?.role?.toUpperCase() === "RIDER"
  ).length;

  const totalAdmins = users.filter(
    (user) => user?.role?.toUpperCase() === "ADMIN"
  ).length;

  // ============================================================
  // OPEN RIDER MODAL
  // ============================================================

  const openRiderModal = (user) => {
    setSelectedUser(user);
    setVehicleType("BIKE");
    setShowRiderModal(true);
    setError("");
  };

  // ============================================================
  // CLOSE RIDER MODAL
  // ============================================================

  const closeRiderModal = () => {
    if (actionLoading) return;

    setShowRiderModal(false);
    setSelectedUser(null);
    setVehicleType("BIKE");
  };

  // ============================================================
  // MAKE USER RIDER
  // ============================================================

  const handleMakeRider = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(selectedUser.id);
      setError("");

      await makeUserRider(
        selectedUser.id,
        vehicleType
      );

      // Close modal
      setShowRiderModal(false);
      setSelectedUser(null);

      // Refresh users
      await fetchUsers();
    } catch (err) {
      console.error("Failed to make rider:", err);

      const apiError =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to make this user a rider.";

      setError(apiError);
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // ROLE BADGE
  // ============================================================

  const getRoleBadge = (role) => {
    const normalizedRole = role?.toUpperCase();

    if (normalizedRole === "ADMIN") {
      return (
        <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          ADMIN
        </span>
      );
    }

    if (normalizedRole === "RIDER") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          RIDER
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        CUSTOMER
      </span>
    );
  };

  // ============================================================
  // USER INITIAL
  // ============================================================

  const getInitial = (user) => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "—";

    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-full">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
            USER MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            Users
          </h1>

          <p className="mt-2 text-slate-500">
            Manage customers, riders and administrators.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ========================================================
          STATS
      ======================================================== */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Users
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalUsers}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600">
              U
            </div>

          </div>

          <p className="mt-4 text-sm text-slate-400">
            All registered users
          </p>

        </div>

        {/* Customers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Customers
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalCustomers}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-lg font-bold text-green-600">
              C
            </div>

          </div>

          <p className="mt-4 text-sm text-slate-400">
            Registered customers
          </p>

        </div>

        {/* Riders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Riders
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalRiders}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
              R
            </div>

          </div>

          <p className="mt-4 text-sm text-slate-400">
            Delivery workforce
          </p>

        </div>

        {/* Admins */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Administrators
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {totalAdmins}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-lg font-bold text-purple-600">
              A
            </div>

          </div>

          <p className="mt-4 text-sm text-slate-400">
            System administrators
          </p>

        </div>

      </div>

      {/* ========================================================
          USER DIRECTORY
      ======================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-slate-200 p-5 sm:p-6">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                User Directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage all registered users.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Search */}
              <div className="relative">

                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-64"
                />

              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="ALL">
                  All Roles
                </option>

                <option value="CUSTOMER">
                  Customers
                </option>

                <option value="RIDER">
                  Riders
                </option>

                <option value="ADMIN">
                  Admins
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="text-sm font-medium text-slate-500">
                Loading users...
              </p>

            </div>

          </div>
        ) : filteredUsers.length === 0 ? (

          /* ====================================================
             EMPTY
          ==================================================== */

          <div className="flex min-h-[300px] items-center justify-center px-6">

            <div className="text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-400">
                U
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                No users found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {search || roleFilter !== "ALL"
                  ? "Try changing your search or filter."
                  : "There are currently no registered users."}
              </p>

            </div>

          </div>

        ) : (

          /* ====================================================
             DESKTOP TABLE
          ==================================================== */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredUsers.map((user) => {

                  const normalizedRole =
                    user?.role?.toUpperCase();

                  const isCustomer =
                    normalizedRole === "CUSTOMER";

                  const isActionLoading =
                    actionLoading === user?.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* User */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">

                            {user?.profile_image ? (
                              <img
                                src={user.profile_image}
                                alt={user?.name || "User"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitial(user)
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate font-semibold text-slate-900">
                              {user?.name || "Unnamed User"}
                            </p>

                            <p className="max-w-[250px] truncate text-sm text-slate-500">
                              {user?.email || "No email"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Phone */}
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {user?.phone_number || "—"}
                      </td>

                      {/* Role */}
                      <td className="px-6 py-5">
                        {getRoleBadge(user?.role)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-2 text-sm font-medium ${
                            user?.is_active
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >

                          <span
                            className={`h-2 w-2 rounded-full ${
                              user?.is_active
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />

                          {user?.is_active
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      {/* Joined */}
                      <td className="px-6 py-5 text-sm text-slate-500">
                        {formatDate(user?.created_at)}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">

                        {isCustomer ? (
                          <button
                            onClick={() =>
                              openRiderModal(user)
                            }
                            disabled={isActionLoading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isActionLoading
                              ? "Processing..."
                              : "Make Rider"}
                          </button>
                        ) : normalizedRole ===
                          "RIDER" ? (
                          <span className="text-sm font-medium text-blue-600">
                            Rider
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-slate-400">
                            Admin
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

        {/* Footer */}
        {!loading && filteredUsers.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">

            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {totalUsers}
              </span>{" "}
              users
            </p>

          </div>
        )}

      </div>

      {/* ========================================================
          MAKE RIDER MODAL
      ======================================================== */}

      {showRiderModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="border-b border-slate-200 px-6 py-5">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Make Rider
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Convert this customer into a delivery rider.
                  </p>
                </div>

                <button
                  onClick={closeRiderModal}
                  disabled={!!actionLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>

              </div>

            </div>

            {/* Modal Body */}
            <div className="space-y-5 px-6 py-6">

              {/* Selected User */}
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                  {getInitial(selectedUser)}
                </div>

                <div className="min-w-0">

                  <p className="truncate font-semibold text-slate-900">
                    {selectedUser?.name || "Unnamed User"}
                  </p>

                  <p className="truncate text-sm text-slate-500">
                    {selectedUser?.email}
                  </p>

                </div>

              </div>

              {/* Vehicle */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Vehicle Type
                </label>

                <select
                  value={vehicleType}
                  onChange={(e) =>
                    setVehicleType(e.target.value)
                  }
                  disabled={!!actionLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="BIKE">
                    Bike
                  </option>

                  <option value="CYCLE">
                    Cycle
                  </option>

                  <option value="CAR">
                    Car
                  </option>

                </select>

              </div>

              {/* Info */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                <p className="text-sm leading-6 text-blue-700">
                  This customer will become a rider and a
                  Rider Profile will be created with the selected
                  vehicle type.
                </p>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">

              <button
                onClick={closeRiderModal}
                disabled={!!actionLoading}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleMakeRider}
                disabled={!!actionLoading}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading
                  ? "Creating Rider..."
                  : "Confirm Rider"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminUsers;