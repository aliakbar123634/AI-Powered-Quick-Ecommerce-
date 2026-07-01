import API from "./api";
import axios from "axios";

// Register
export const registerUser = (data) =>
  axios.post(
    "http://127.0.0.1:8000/api/accounts/register/",
    data
  );

// Login
export const loginUser = (data) =>
  axios.post(
    "http://127.0.0.1:8000/api/accounts/login/",
    data
  );

// Logout
export const logoutUser = () =>
  API.post("accounts/logout/");

export const getProfile = () =>
  API.get("accounts/profiles/");

export const updateProfile = (id, data) =>
  API.patch(`accounts/profiles/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });