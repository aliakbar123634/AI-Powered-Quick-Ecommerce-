
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const location = useLocation();
  console.log("ProtectedRoute");
  console.log("Auth:", isAuthenticated);
  console.log("Path:", location.pathname);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
};

export default ProtectedRoute;
