import React from "react";

import OrderCard from "./OrderCard";


const OrdersList = ({ orders }) => {


  return (

    <section
      className="
      max-w-7xl
      mx-auto
      px-6
      pb-12
      "
    >


      <div
        className="
        grid
        gap-6
        "
      >


        {


          orders.map((order) => (


            <OrderCard

              key={order.id}

              order={order}

            />


          ))


        }


      </div>


    </section>

  );

};


export default OrdersList;