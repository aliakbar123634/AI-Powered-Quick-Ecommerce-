
import React, { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    password2: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Frontend validation
    if (formData.password !== formData.password2) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(formData);

      setMessage(response.message);

      setFormData({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        password2: "",
      });

      // 2 second baad login page par bhej do
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.log(error);

      if (error.response?.data) {
        setMessage(JSON.stringify(error.response.data));
      } else {
        setMessage("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register</h1>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

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
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;