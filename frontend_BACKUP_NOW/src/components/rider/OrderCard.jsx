import {
    acceptOrder,
    pickedUpOrder,
    outForDeliveryOrder,
    deliveredOrder,
} from "../../api/riderApi";
import ConfirmActionModal from "./ConfirmActionModal";
import { useState } from "react";
const OrderCard = ({ order ,onRefresh }) => {
    const [openModal, setOpenModal] = useState(false);
    const handleAction = async () => {

    try {

        if (order.delivery_status === "PENDING") {

            await acceptOrder(order.id);

        }

        else if (order.delivery_status === "ASSIGNED") {

            await pickedUpOrder(order.id);

        }

        else if (order.delivery_status === "PICKED_UP") {

            await outForDeliveryOrder(order.id);

        }

        else if (order.delivery_status === "OUT_FOR_DELIVERY") {

            await deliveredOrder(order.id);

        }

        onRefresh();

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong.");

    }

};
  return (
    <div className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-xl transition">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-xl font-bold">
            {order.order_number}
          </h2>

          <p className="text-gray-500 mt-2">
            👤 {order.customer_name}
          </p>

          <p className="text-gray-500">
            📞 {order.customer_phone}
          </p>

          <p className="text-gray-500">
            💵 ${order.total_price}
          </p>

        </div>

        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">

          {order.delivery_status}

        </span>

      </div>
      <div className="mt-6">

    {

        order.delivery_status === "DELIVERED"

        ?

        <button
            disabled
            className="w-full bg-green-600 text-white py-3 rounded-xl"
        >

            Delivered ✔

        </button>



        :

        <button

            // onClick={handleAction}
            onClick={() => setOpenModal(true)}

            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"

        >

            {

                order.delivery_status === "PENDING"

                ?

                "Accept"

                :

                order.delivery_status === "ASSIGNED"

                ?

                "Picked Up"

                :

                order.delivery_status === "PICKED_UP"

                ?

                "Out For Delivery"

                :

                "Delivered"

            }

        </button>

    }
    <ConfirmActionModal

    isOpen={openModal}

    title="Confirm Action"

    message={`Are you sure you want to ${

        order.delivery_status === "PENDING"

            ? "accept this order?"

            : order.delivery_status === "ASSIGNED"

            ? "mark this order as Picked Up?"

            : order.delivery_status === "PICKED_UP"

            ? "mark this order as Out For Delivery?"

            : "mark this order as Delivered?"

    }`}

    onCancel={() => setOpenModal(false)}

    onConfirm={() => {

        setOpenModal(false);

        handleAction();

    }}

/>

</div>

    </div>
  );
};

export default OrderCard;