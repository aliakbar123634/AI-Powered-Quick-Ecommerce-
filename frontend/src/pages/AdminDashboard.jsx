import React, { useState } from "react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import AdminOrders from "../components/admin/AdminOrders";
import AdminRiders from "../components/admin/AdminRiders";
import AdminWarehouses from "../components/admin/AdminWarehouses";
import AdminInventory from "../components/admin/AdminInventory";

const AdminDashboard = () => {

  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {

    switch (activeSection) {

      case "orders":
        return <AdminOrders />;

      case "riders":
        return <AdminRiders />;

      case "warehouses":
        return <AdminWarehouses />;

      case "inventory":
        return <AdminInventory />;

      default:
        return <AdminStats />;

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1">

        <AdminHeader />

        <main className="p-8">

          {renderContent()}

        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;