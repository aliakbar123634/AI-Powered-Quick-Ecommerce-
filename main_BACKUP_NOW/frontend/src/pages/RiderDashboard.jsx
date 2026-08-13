

import RiderHeader from "../components/rider/RiderHeader";
import RiderStats from "../components/rider/RiderStats";

import RiderDashboardSkeleton from "../components/rider/RiderDashboardSkeleton";
import RiderOrderSection from "../components/rider/RiderOrderSection";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getMyOrders } from "../api/riderApi";

const RiderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // await new Promise((resolve) => setTimeout(resolve, 3000)); 
            const response = await getMyOrders();

            console.log(response.data);

            setOrders(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    const pendingOrders = orders.filter(
    (order) => order.delivery_status === "PENDING"
);

const assignedOrders = orders.filter(
    (order) => order.delivery_status === "ASSIGNED"
);

const pickedUpOrders = orders.filter(
    (order) => order.delivery_status === "PICKED_UP"
);

const outForDeliveryOrders = orders.filter(
    (order) => order.delivery_status === "OUT_FOR_DELIVERY"
);

const deliveredOrders = orders.filter(
    (order) => order.delivery_status === "DELIVERED"
);



if (loading) {
    return <RiderDashboardSkeleton />;
}

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-8">

                    <RiderHeader />

                    <RiderStats  pending={pendingOrders.length}  assigned={assignedOrders.length}  pickedUp={pickedUpOrders.length}  outForDelivery={outForDeliveryOrders.length}  delivered={deliveredOrders.length}  />

                    <RiderOrderSection  title="🟡 Pending Orders" orders={pendingOrders} onRefresh={fetchOrders}/>

                    <RiderOrderSection title="🔵 Assigned Orders" orders={assignedOrders} onRefresh={fetchOrders}/>

                    <RiderOrderSection title="🟣 Picked Up Orders"  orders={pickedUpOrders}  onRefresh={fetchOrders}/>

                    <RiderOrderSection title="🟠 Out For Delivery" orders={outForDeliveryOrders} onRefresh={fetchOrders}/>
                    <RiderOrderSection title="🟢 Delivered Orders" orders={deliveredOrders} onRefresh={fetchOrders}/>

                </div>
            </div>
        </>
    );
};

export default RiderDashboard;