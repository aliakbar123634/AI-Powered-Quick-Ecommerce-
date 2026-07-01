import React from 'react'
import { useState } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { loginUser } from "../api/authApi";
import { useNavigate  , useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
      console.log(location.state);
console.log(from);
    const [formData, setFormData] = useState({email:"", password:""})
    const login = useAuthStore((state) => state.login);
    const handleChange=(e)=>{
    const { name, value } = e.target;
          setFormData({
      ...formData,
      [name]: value,
    });
    }

const onSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await loginUser(formData);

    login(
      response.data.access,
      response.data.refresh
    );

localStorage.setItem(
  "access",
  response.data.access
);

localStorage.setItem(
  "refresh",
  response.data.refresh
);

navigate(from, { replace: true });

  } catch (error) {
    console.log("LOGIN ERROR");
    console.log(error.response?.data);
    console.log(error.response?.status);
  }
};

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}        
            />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}        
            />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
