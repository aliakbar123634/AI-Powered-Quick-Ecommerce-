import React from 'react'
import Navbar from "../components/Navbar";
import EditProfileBreadcrumb from "../components/EditProfileBreadcrumb"
import EditProfileHeader from "../components/EditProfileHeader";
import EditProfileForm from "../components/EditProfileForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
} from "../api/authApi";

const EditProfile = () => {
    const navigate = useNavigate();

const [loading, setLoading] = useState(true);

const [userId, setUserId] = useState(null);

const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone_number: "",
  bio: "",
  date_of_birth: "",
  profile_image: null,
});
   useEffect(() => {

    const fetchProfile = async () => {

        try {

            const response = await getProfile();

            const user = response.data.results[0];

            setUserId(user.id);

            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone_number: user.phone_number || "",
                bio: user.bio || "",
                date_of_birth: user.date_of_birth || "",
                profile_image: user.profile_image || null,
            });

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    fetchProfile();

}, []);
const handleChange = (e) => {

    const { name, value, files } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
    }));

};
const handleCancel = () => {
    navigate("/profile");
};

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const data = new FormData();

        data.append("name", formData.name);
        data.append("phone_number", formData.phone_number);
        data.append("bio", formData.bio);
        data.append("date_of_birth", formData.date_of_birth);

        if (
            formData.profile_image &&
            typeof formData.profile_image !== "string"
        ) {
            data.append("profile_image", formData.profile_image);
        }

        const response = await updateProfile(userId, data);

        console.log(response.data);

        alert("Profile Updated Successfully");

        navigate("/profile");

    } catch (error) {

        console.log(error);

    }

};
  return (
    <>
      <Navbar />
      <EditProfileBreadcrumb/>
      <EditProfileHeader/>
      <EditProfileForm formData={formData}  handleChange={handleChange}  handleSubmit={handleSubmit} handleCancel={handleCancel} loading={loading}/>
    </>
  )
}

export default EditProfile