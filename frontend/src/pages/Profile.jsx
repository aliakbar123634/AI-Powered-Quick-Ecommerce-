import Navbar from "../components/Navbar";
import ProfileBreadcrumb from "../components/ProfileBreadcrumb";
import ProfileHeader from "../components/ProfileHeader";
import UserProfileCard from "../components/UserProfileCard";
import ProfileDetails from "../components/ProfileDetails";
import SavedAddresses from "../components/SavedAddresses";
import ProfileStats from "../components/ProfileStats";
import RecentOrders from "../components/RecentOrders";
import ProfileActions from "../components/ProfileActions";
import { useEffect, useState } from "react";
import {getProfile} from "../api/authApi";
import {getOrders} from "../api/orderApi";

const Profile = () => {
   const [user, setUser] = useState(null);
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);
   const handleLogout = () => {

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");

    navigate("/login");

};
//    useEffect(() => {

//     const fetchProfile = async () => {

//         try {

//             const response = await getProfile();

//             setUser(response.data.results[0]);
//             console.log(response.data.results[0])

//         } catch (error) {

//             console.log(error);

//         } finally {

//             setLoading(false);

//         }

//     };

//     fetchProfile();

// }, []);


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
      {/* Next Sections */}

    </>
  );
};

export default Profile;