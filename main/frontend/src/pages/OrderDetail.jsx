import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetail , cancelOrder } from "../api/orderApi";
import Navbar from "../components/Navbar";
import OrderDetailBreadcrumb from "../components/OrderDetailBreadcrumb";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderInfo from "../components/OrderInfo";
import OrderItems from "../components/OrderItems";
import OrderSummary from "../components/OrderSummary";
import OrderActions from "../components/OrderActions";
import DeliveryTracking from "../components/DeliveryTracking";
import Footer from "../components/footer/Footer";
const OrderDetail = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderDetail(id);
        setOrder(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);
  // const handleCancelOrder=async (id)=>{
  //   try {
  //     const response = await cancelOrder(id);

  //     console.log(response.data);

  //     alert(response.data.message);
  //   } catch (error) {
  //   console.log(error);
  //   if (error.response) {
  //   alert(error.response.data.error);
  // }
  //   }
  // }
     const handleCancelOrder = async (id) => {
  try {
    const response = await cancelOrder(id);

    alert(response.data.message);

    setOrder((prev) => ({
      ...prev,
      status: "CANCELLED",
    }));
  } catch (error) {
    console.log(error);

    if (error.response) {
      alert(error.response.data.error);
    }
  }
};

  if (loading) return <h2>Loading...</h2>;

  if (!order) return <h2>Order Not Found</h2>;

  return (
<>

  <Navbar />

  <OrderDetailBreadcrumb />

  <div className="max-w-7xl mx-auto px-6 py-10">

    {/* Order Header */}
    <OrderInfo order={order} />

    {/* Items + Summary */}
    <div className="grid lg:grid-cols-12 gap-8 mt-8">

      {/* Left */}
       <div className="lg:col-span-8">
        <OrderItems items={order.items} />
      </div> 

      {/* Right */}
      <div className="lg:col-span-4">

        <OrderSummary order={order} />

        <div className="mt-6">
          <OrderActions
            order={order}
            onCancelOrder={handleCancelOrder}
          />
        </div>

      </div>

    </div>   


    {/* Delivery Tracking */}
     <div className="mt-10">
      <DeliveryTracking orderId={id} />
    </div> 



  </div>
  <Footer/>
</>

  );
};

export default OrderDetail;