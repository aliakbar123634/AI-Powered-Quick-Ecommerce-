import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Request Interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  const publicRoutes = [
    "accounts/login/",
    "accounts/register/",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    config.url.includes(route)
  );

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;