import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

const RiderNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/rider"
          className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition"
        >
          Rider Panel
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-7">

          {/* Dashboard */}
          <Link
            to="/rider"
            className="flex items-center gap-2 text-white hover:text-blue-400 font-medium transition"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </Link>

          {/* Profile */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-white hover:text-blue-400 font-medium transition"
          >
            <User size={19} />
            Profile
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default RiderNavbar;