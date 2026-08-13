import Navbar from "../components/Navbar";
import ProfileBreadcrumb from "../components/ProfileBreadcrumb";
import ProfileHeader from "../components/ProfileHeader";
import UserProfileCard from "../components/UserProfileCard";
import ProfileDetails from "../components/ProfileDetails";
import SavedAddresses from "../components/SavedAddresses";
import ProfileStats from "../components/ProfileStats";
import RecentOrders from "../components/RecentOrders";
import ProfileActions from "../components/ProfileActions";
import Footer from "../components/footer/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import {getProfile} from "../api/authApi";
import {getOrders} from "../api/orderApi";

const Profile = () => {
   const navigate = useNavigate();
   const [user, setUser] = useState(null);
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const handleLogout = () => {

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");
        // Agar user bhi store kiya hai
    localStorage.removeItem("user");

    // Login page par bhejo
    navigate("/login", { replace: true });

    // navigate("/login");

};



useEffect(() => {

    const fetchData = async () => {

        try {

            const [profileResponse, ordersResponse] =
                await Promise.all([
                    getProfile(),
                    getOrders()
                ]);

            setUser(profileResponse.data.results[0]);

            setOrders(ordersResponse.data.results);

            console.log(profileResponse.data.results[0]);
            console.log(ordersResponse.data.results);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    fetchData();

}, []);
   if (loading) return <h2>Loading...</h2>;
  return (
    <>
      <Navbar />
      <ProfileBreadcrumb />
      <ProfileHeader/>
      <UserProfileCard user={user} />
      <ProfileDetails user={user} />
      <SavedAddresses addresses={user?.addresses} />
      <ProfileStats />
      <RecentOrders orders={orders} />
      <ProfileActions onLogout={handleLogout} />
      <Footer/>


    </>
  );
};

export default Profile;