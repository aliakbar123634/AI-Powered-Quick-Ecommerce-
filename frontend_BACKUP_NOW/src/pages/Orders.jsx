
import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import OrdersBreadcrumb from "../components/OrdersBreadcrumb";
import OrdersHeader from "../components/OrdersHeader";
import OrdersList from "../components/OrdersList";
import Footer from "../components/footer/Footer";
import { getOrders } from "../api/orderApi";


const Orders = () => {


  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    const fetchOrders = async () => {


      try {


        const response = await getOrders();


        setOrders(
          response.data.results
        );


      } catch (error) {


        console.log(error);


      } finally {


        setLoading(false);


      }


    };


    fetchOrders();


  }, []);




  if (loading) {


    return (

      <>

        <Navbar />


        <div
          className="
          min-h-[60vh]
          flex
          items-center
          justify-center
          text-2xl
          font-semibold
          "
        >

          Loading Orders...

        </div>

        <Footer/>
      </>

    );


  }




  return (

    <>


      <Navbar />


      <OrdersBreadcrumb />


      <OrdersHeader />



      {


        orders.length > 0 ? (


          <OrdersList

            orders={orders}

          />


        ) : (


          <div
            className="
            min-h-[50vh]
            flex
            flex-col
            items-center
            justify-center
            "
          >


            <h2
              className="
              text-3xl
              font-bold
              "
            >

              No Orders Yet

            </h2>


            <p
              className="
              text-gray-500
              mt-3
              "
            >

              Your orders will appear here after checkout.


            </p>


          </div>


        )

      }



    </>

  );

};


export default Orders;