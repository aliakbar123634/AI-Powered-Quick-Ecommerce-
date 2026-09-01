

import React, { useEffect, useMemo, useState } from "react";

import {
  getAdminInventory,
  getLowStock,
  createInventory,
  updateInventory,
  deleteInventory,
  getAdminWarehouses,
} from "../../api/adminApi";

const emptyForm = {
  warehouse: "",
  product: "",
  quantity: 0,
  reorder_level: 10,
};

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] =
    useState("ALL");

  const [showLowStockOnly, setShowLowStockOnly] =
    useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] =
    useState(emptyForm);

  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const [inventoryResponse, warehouseResponse] =
        await Promise.all([
          getAdminInventory(),
          getAdminWarehouses(),
        ]);

      const inventoryData =
        inventoryResponse.data;

      const warehouseData =
        warehouseResponse.data;

      setInventory(
        inventoryData.results ||
          inventoryData ||
          []
      );

      setWarehouses(
        warehouseData.results ||
          warehouseData ||
          []
      );
    } catch (error) {
      console.error(
        "Admin inventory error:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // =========================================================
  // FORM
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingItem(null);

    setFormData({
      warehouse:
        warehouses.length > 0
          ? warehouses[0].id
          : "",
      product: "",
      quantity: 0,
      reorder_level: 10,
    });

    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);

    setFormData({
      warehouse: item.warehouse || "",
      product: item.product || "",
      quantity: item.quantity ?? 0,
      reorder_level:
        item.reorder_level ?? 10,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingItem(null);
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
        warehouse: formData.warehouse,
        product: formData.product,
        quantity: Number(formData.quantity),
        reorder_level: Number(
          formData.reorder_level
        ),
      };

      if (editingItem) {
        await updateInventory(
          editingItem.id,
          payload
        );
      } else {
        await createInventory(payload);
      }

      closeModal();

      await fetchInventory();
    } catch (error) {
      console.error(
        "Inventory save error:",
        error
      );

      const backendError =
        error.response?.data;

      if (
        backendError &&
        typeof backendError === "object"
      ) {
        const firstError = Object.values(
          backendError
        )[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : firstError ||
                "Failed to save inventory."
        );
      } else {
        setError(
          backendError ||
            "Failed to save inventory."
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

      await deleteInventory(deleteId);

      setDeleteId(null);

      await fetchInventory();
    } catch (error) {
      console.error(
        "Inventory delete error:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to delete inventory item."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        item.product_name
          ?.toLowerCase()
          .includes(searchText) ||
        item.warehouse_name
          ?.toLowerCase()
          .includes(searchText);

      const matchesWarehouse =
        warehouseFilter === "ALL" ||
        String(item.warehouse) ===
          String(warehouseFilter);

      const matchesLowStock =
        !showLowStockOnly ||
        item.is_low_stock;

      return (
        matchesSearch &&
        matchesWarehouse &&
        matchesLowStock
      );
    });
  }, [
    inventory,
    search,
    warehouseFilter,
    showLowStockOnly,
  ]);

  // =========================================================
  // STATS
  // =========================================================

  const totalItems = inventory.length;

  const lowStockCount = inventory.filter(
    (item) => item.is_low_stock
  ).length;

  const healthyCount =
    totalItems - lowStockCount;

  const totalQuantity = inventory.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse"
            />
          ))}

        </div>

        <div className="h-96 bg-white border border-slate-200 rounded-2xl animate-pulse" />

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div className="flex items-center gap-3">

          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-gradient-to-br
              from-blue-600
              to-purple-600
              text-white
              flex
              items-center
              justify-center
              shadow-lg
              shadow-blue-500/20
            "
          >
            <span className="text-xl">
              ▤
            </span>
          </div>

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Inventory
            </h1>

            <p className="text-slate-500 mt-1">
              Manage warehouse stock and inventory levels.
            </p>

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
            transition
          "
        >
          <span className="text-lg">
            +
          </span>

          Add Inventory
        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-4">

          <div>

            <p className="font-semibold text-red-700">
              Something went wrong
            </p>

            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>

          </div>

          <button
            onClick={fetchInventory}
            className="text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Retry
          </button>

        </div>
      )}


      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Total */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Inventory Records
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {totalItems}
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              ▤
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-3">
            Products stored across warehouses
          </p>

        </div>


        {/* Quantity */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total Units
              </p>

              <p className="text-3xl font-bold text-slate-900 mt-2">
                {totalQuantity}
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              #
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-3">
            Current stock across all warehouses
          </p>

        </div>


        {/* Low Stock */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Low Stock
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {lowStockCount}
              </p>

            </div>

            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              !
            </div>

          </div>

          <p className="text-xs text-slate-400 mt-3">
            {healthyCount} records currently healthy
          </p>

        </div>

      </div>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}

          <div className="relative flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search product or warehouse..."
              className="
                w-full
                pl-10
                pr-4
                py-3
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                text-sm
                text-slate-800
                placeholder:text-slate-400
                focus:bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/20
                focus:border-blue-500
              "
            />

          </div>


          {/* Warehouse */}

          <select
            value={warehouseFilter}
            onChange={(e) =>
              setWarehouseFilter(
                e.target.value
              )
            }
            className="
              lg:w-64
              px-4
              py-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              text-sm
              text-slate-700
              focus:bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/20
              focus:border-blue-500
            "
          >

            <option value="ALL">
              All Warehouses
            </option>

            {warehouses.map((warehouse) => (
              <option
                key={warehouse.id}
                value={warehouse.id}
              >
                {warehouse.name}
              </option>
            ))}

          </select>


          {/* Low Stock */}

          <button
            onClick={() =>
              setShowLowStockOnly(
                !showLowStockOnly
              )
            }
            className={`
              px-4
              py-3
              rounded-xl
              text-sm
              font-semibold
              border
              transition
              ${
                showLowStockOnly
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }
            `}
          >
            {showLowStockOnly
              ? "Showing Low Stock"
              : "Low Stock Only"}
          </button>

        </div>

      </div>


      {/* =====================================================
          INVENTORY TABLE
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Inventory Records
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {filteredInventory.length} records shown
            </p>

          </div>

          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
            {filteredInventory.length}
          </span>

        </div>


        {filteredInventory.length === 0 ? (

          <div className="p-14 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
              ▤
            </div>

            <h3 className="font-bold text-slate-900 mt-4">
              No inventory found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try changing your filters or add a new inventory record.
            </p>

            <button
              onClick={openCreateModal}
              className="
                mt-5
                px-5
                py-2.5
                rounded-xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                font-semibold
              "
            >
              Add Inventory
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50 border-b border-slate-200">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Warehouse
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

                  <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredInventory.map(
                  (item) => (

                    <tr
                      key={item.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition"
                    >

                      {/* Product */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            P
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {item.product_name ||
                                `Product #${item.product}`}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              ID: {item.product}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Warehouse */}

                      <td className="px-6 py-5">

                        <p className="font-medium text-slate-800">
                          {item.warehouse_name ||
                            `Warehouse #${item.warehouse}`}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          ID: {item.warehouse}
                        </p>

                      </td>


                      {/* Quantity */}

                      <td className="px-6 py-5">

                        <p className="font-bold text-slate-900">
                          {item.quantity}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          units
                        </p>

                      </td>


                      {/* Reorder */}

                      <td className="px-6 py-5">

                        <span className="text-sm font-semibold text-slate-700">
                          {item.reorder_level}
                        </span>

                      </td>


                      {/* Status */}

                      <td className="px-6 py-5">

                        {item.is_low_stock ? (

                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">

                            <span className="w-2 h-2 rounded-full bg-red-500" />

                            Low Stock

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">

                            <span className="w-2 h-2 rounded-full bg-green-500" />

                            Healthy

                          </span>

                        )}

                      </td>


                      {/* Actions */}

                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            onClick={() =>
                              openEditModal(item)
                            }
                            className="
                              px-3
                              py-2
                              rounded-lg
                              bg-slate-100
                              text-slate-700
                              text-sm
                              font-semibold
                              hover:bg-slate-200
                              transition
                            "
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              setDeleteId(
                                item.id
                              )
                            }
                            className="
                              px-3
                              py-2
                              rounded-lg
                              bg-red-50
                              text-red-600
                              text-sm
                              font-semibold
                              hover:bg-red-100
                              transition
                            "
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingItem
                    ? "Edit Inventory"
                    : "Add Inventory"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingItem
                    ? "Update stock information."
                    : "Add a product to a warehouse."}
                </p>

              </div>

              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="space-y-5">

                {/* Warehouse */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Warehouse
                  </label>

                  <select
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleChange}
                    required
                    disabled={Boolean(
                      editingItem
                    )}
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      text-sm
                      focus:bg-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500/20
                      focus:border-blue-500
                      disabled:opacity-60
                    "
                  >

                    <option value="">
                      Select warehouse
                    </option>

                    {warehouses.map(
                      (warehouse) => (

                        <option
                          key={warehouse.id}
                          value={warehouse.id}
                        >
                          {warehouse.name}
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* Product */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product ID
                  </label>

                  <input
                    type="number"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    required
                    disabled={Boolean(
                      editingItem
                    )}
                    placeholder="Enter product ID"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      text-sm
                      focus:bg-white
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-500/20
                      focus:border-blue-500
                      disabled:opacity-60
                    "
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Enter the ID of the product you want to stock.
                  </p>

                </div>


                {/* Quantity + Reorder */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Quantity
                    </label>

                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="0"
                      required
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        focus:bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                      "
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Reorder Level
                    </label>

                    <input
                      type="number"
                      name="reorder_level"
                      value={
                        formData.reorder_level
                      }
                      onChange={handleChange}
                      min="0"
                      required
                      className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50
                        focus:bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                      "
                    />

                  </div>

                </div>

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-slate-200">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-slate-200
                    text-slate-700
                    font-semibold
                    hover:bg-slate-50
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    px-6
                    py-2.5
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    text-white
                    font-semibold
                    shadow-lg
                    shadow-blue-500/20
                    disabled:opacity-60
                  "
                >
                  {saving
                    ? "Saving..."
                    : editingItem
                    ? "Update Inventory"
                    : "Add Inventory"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          DELETE MODAL
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

            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl font-bold">
              !
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-5">
              Delete Inventory?
            </h2>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              This will permanently remove this inventory record. The product itself will not be deleted.
            </p>

            <div className="flex justify-end gap-3 mt-7">

              <button
                onClick={() =>
                  setDeleteId(null)
                }
                disabled={deleting}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  border-slate-200
                  text-slate-700
                  font-semibold
                  hover:bg-slate-50
                "
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-red-600
                  text-white
                  font-semibold
                  hover:bg-red-700
                  disabled:opacity-60
                "
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Inventory"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminInventory;