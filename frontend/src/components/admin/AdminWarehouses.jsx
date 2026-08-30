import React, { useEffect, useState } from "react";
import {
  getAdminWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseStock,
} from "../../api/adminApi";

const emptyForm = {
  name: "",
  city: "",
  area: "",
  latitude: "",
  longitude: "",
  service_radius_km: 10,
  is_active: true,
};

const AdminWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [stockWarehouse, setStockWarehouse] = useState(null);
  const [stock, setStock] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState("");

  // =========================================================
  // FETCH WAREHOUSES
  // =========================================================

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminWarehouses();

      const data = response.data;

      setWarehouses(data.results || data || []);
    } catch (error) {
      console.error("Admin warehouses error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load warehouses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // =========================================================
  // FORM HANDLING
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateModal = () => {
    setEditingWarehouse(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (warehouse) => {
    setEditingWarehouse(warehouse);

    setFormData({
      name: warehouse.name || "",
      city: warehouse.city || "",
      area: warehouse.area || "",
      latitude: warehouse.latitude || "",
      longitude: warehouse.longitude || "",
      service_radius_km:
        warehouse.service_radius_km || 10,
      is_active: warehouse.is_active ?? true,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingWarehouse(null);
    setFormData(emptyForm);
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name.trim(),
        city: formData.city.trim(),
        area: formData.area.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        service_radius_km: Number(
          formData.service_radius_km
        ),
        is_active: formData.is_active,
      };

      if (editingWarehouse) {
        await updateWarehouse(
          editingWarehouse.id,
          payload
        );
      } else {
        await createWarehouse(payload);
      }

      closeModal();

      await fetchWarehouses();
    } catch (error) {
      console.error("Warehouse save error:", error);

      const backendError = error.response?.data;

      if (typeof backendError === "object") {
        const firstError = Object.values(
          backendError
        )[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : firstError || "Failed to save warehouse."
        );
      } else {
        setError(
          backendError ||
            "Failed to save warehouse."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setError("");

      await deleteWarehouse(deleteId);

      setDeleteId(null);

      await fetchWarehouses();
    } catch (error) {
      console.error("Warehouse delete error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to delete warehouse."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // VIEW STOCK
  // =========================================================

  const handleViewStock = async (warehouse) => {
    try {
      setStockWarehouse(warehouse);
      setStock([]);
      setStockError("");
      setStockLoading(true);

      const response = await getWarehouseStock(
        warehouse.id
      );

      const data = response.data;

      setStock(data.results || data || []);
    } catch (error) {
      console.error("Warehouse stock error:", error);

      setStockError(
        error.response?.data?.detail ||
          "Failed to load warehouse stock."
      );
    } finally {
      setStockLoading(false);
    }
  };

  const closeStockModal = () => {
    setStockWarehouse(null);
    setStock([]);
    setStockError("");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />

          <div className="h-4 w-80 bg-slate-200 rounded mt-3 animate-pulse" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">

          <div className="space-y-4">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">

              <span className="text-xl">
                ⌂
              </span>

            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                Warehouses
              </h1>

              <p className="text-slate-500 mt-1">
                Manage warehouses and service areas.
              </p>

            </div>

          </div>

        </div>

        <button
          onClick={openCreateModal}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            rounded-xl
            text-white
            font-semibold
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            shadow-lg
            shadow-blue-500/20
            hover:shadow-xl
            hover:shadow-blue-500/30
            transition
          "
        >
          <span className="text-lg">
            +
          </span>

          Add Warehouse
        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start justify-between gap-4">

          <div>

            <p className="font-semibold text-red-700">
              Something went wrong
            </p>

            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>

          </div>

          <button
            onClick={fetchWarehouses}
            className="text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Retry
          </button>

        </div>
      )}


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Total Warehouses
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {warehouses.length}
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Active Warehouses
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {
              warehouses.filter(
                (warehouse) =>
                  warehouse.is_active
              ).length
            }
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-slate-500">
            Inactive Warehouses
          </p>

          <p className="text-3xl font-bold text-slate-400 mt-2">
            {
              warehouses.filter(
                (warehouse) =>
                  !warehouse.is_active
              ).length
            }
          </p>

        </div>

      </div>


      {/* =====================================================
          WAREHOUSE TABLE
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              All Warehouses
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage your warehouse locations.
            </p>

          </div>

          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
            {warehouses.length} total
          </span>

        </div>


        {warehouses.length === 0 ? (

          <div className="p-14 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-2xl text-slate-400">
              ⌂
            </div>

            <h3 className="font-bold text-slate-900 mt-4">
              No warehouses found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Create your first warehouse to get started.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
            >
              Add Warehouse
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Warehouse
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Location
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Radius
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Products
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {warehouses.map((warehouse) => (

                  <tr
                    key={warehouse.id}
                    className="border-b last:border-b-0 border-slate-100 hover:bg-slate-50/70 transition"
                  >

                    {/* Warehouse */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          W
                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {warehouse.name}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            ID: {warehouse.id}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Location */}

                    <td className="px-6 py-5">

                      <p className="font-medium text-slate-800">
                        {warehouse.city}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {warehouse.area}
                      </p>

                    </td>


                    {/* Radius */}

                    <td className="px-6 py-5">

                      <span className="text-sm font-semibold text-slate-700">
                        {warehouse.service_radius_km} km
                      </span>

                    </td>


                    {/* Products */}

                    <td className="px-6 py-5">

                      <span className="text-sm font-semibold text-slate-700">
                        {warehouse.total_products ?? 0}
                      </span>

                    </td>


                    {/* Status */}

                    <td className="px-6 py-5">

                      {warehouse.is_active ? (

                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">

                          <span className="w-2 h-2 rounded-full bg-green-500" />

                          Active

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">

                          <span className="w-2 h-2 rounded-full bg-slate-400" />

                          Inactive

                        </span>

                      )}

                    </td>


                    {/* Actions */}

                    <td className="px-6 py-5">

                      <div className="flex items-center justify-end gap-2">

                        <button
                          onClick={() =>
                            handleViewStock(
                              warehouse
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition"
                        >
                          Stock
                        </button>

                        <button
                          onClick={() =>
                            openEditModal(
                              warehouse
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            setDeleteId(
                              warehouse.id
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Modal Header */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingWarehouse
                    ? "Edit Warehouse"
                    : "Add Warehouse"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingWarehouse
                    ? "Update warehouse information."
                    : "Create a new warehouse location."}
                </p>

              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Name */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Warehouse Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bahawalpur Central Warehouse"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />

                </div>


                {/* City */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />

                </div>


                {/* Area */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Area
                  </label>

                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    placeholder="Area"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />

                </div>


                {/* Latitude */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 29.3956"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />

                </div>


                {/* Longitude */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 71.6833"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />

                </div>


                {/* Radius */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Service Radius (km)
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="service_radius_km"
                    value={
                      formData.service_radius_km
                    }
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />

                </div>


                {/* Active */}

                <div className="flex items-end">

                  <label className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">

                    <input
                      type="checkbox"
                      name="is_active"
                      checked={
                        formData.is_active
                      }
                      onChange={handleChange}
                      className="w-4 h-4 accent-blue-600"
                    />

                    <div>

                      <p className="text-sm font-semibold text-slate-700">
                        Active Warehouse
                      </p>

                      <p className="text-xs text-slate-500">
                        Available for operations
                      </p>

                    </div>

                  </label>

                </div>

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-slate-200">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingWarehouse
                    ? "Update Warehouse"
                    : "Create Warehouse"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteId && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() =>
              deleting
                ? null
                : setDeleteId(null)
            }
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl">
              !
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-5">
              Delete Warehouse?
            </h2>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              This action cannot be undone. Make sure this warehouse is no longer needed before deleting it.
            </p>

            <div className="flex justify-end gap-3 mt-7">

              <button
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Warehouse"}
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          STOCK MODAL
      ===================================================== */}

      {stockWarehouse && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={closeStockModal}
          />

          <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* Header */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {stockWarehouse.name}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Warehouse inventory and stock levels
                </p>

              </div>

              <button
                onClick={closeStockModal}
                className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ×
              </button>

            </div>


            {/* Content */}

            <div className="overflow-y-auto">

              {stockLoading ? (

                <div className="p-12 text-center">

                  <div className="w-8 h-8 mx-auto rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />

                  <p className="text-sm text-slate-500 mt-4">
                    Loading stock...
                  </p>

                </div>

              ) : stockError ? (

                <div className="p-8">

                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
                    {stockError}
                  </div>

                </div>

              ) : stock.length === 0 ? (

                <div className="p-12 text-center">

                  <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xl">
                    ▤
                  </div>

                  <p className="font-semibold text-slate-800 mt-4">
                    No inventory found
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    This warehouse currently has no stock records.
                  </p>

                </div>

              ) : (

                <table className="w-full">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Product
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Quantity
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Reorder Level
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {stock.map((item) => (

                      <tr
                        key={item.id}
                        className="border-b border-slate-100"
                      >

                        <td className="px-6 py-4">

                          <p className="font-semibold text-slate-800">
                            {item.product_name ||
                              `Product #${item.product}`}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Product ID: {item.product}
                          </p>

                        </td>

                        <td className="px-6 py-4">

                          <span className="font-bold text-slate-900">
                            {item.quantity}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {item.reorder_level}
                        </td>

                        <td className="px-6 py-4">

                          {item.is_low_stock ? (

                            <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                              Low Stock
                            </span>

                          ) : (

                            <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-semibold">
                              Healthy
                            </span>

                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminWarehouses;