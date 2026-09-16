import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const location = useLocation();

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
