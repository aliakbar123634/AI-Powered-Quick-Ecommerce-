// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const AdminRoute = () => {

//   const user = JSON.parse(
//     localStorage.getItem("user")
//   );

//   // User login nahi hai
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // User admin nahi hai
//   if (user.role !== "ADMIN") {
//     return <Navigate to="/" replace />;
//   }

//   // Admin hai
//   return <Outlet />;
// };

// export default AdminRoute;





import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const AdminRoute = () => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const user = useAuthStore(
    (state) => state.user
  );

  // Login nahi hai
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User data abhi available nahi
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Admin nahi hai
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Admin hai
  return <Outlet />;
};

export default AdminRoute;