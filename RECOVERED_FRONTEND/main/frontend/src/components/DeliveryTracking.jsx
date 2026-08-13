// import { useEffect, useState } from "react";
// import { getDeliveryTracking } from "../api/deliveryApi";

// const DeliveryTracking = ({ orderId }) => {

//     const [delivery, setDelivery] = useState(null);

//     useEffect(() => {
//         fetchDelivery();
//     }, [orderId]);

//     const fetchDelivery = async () => {

//         try {

//             const response = await getDeliveryTracking(orderId);
//             console.log(response.data);
            

//             setDelivery(response.data.results[0]);

//         } catch (error) {

//             console.log(error);

//         }

//     };

//     if (!delivery) {

//         return <p>Loading Delivery...</p>;

//     }

//     return (

//         <div>

//             <h2>Delivery Tracking</h2>

//             <pre>

//                 {JSON.stringify(delivery, null, 2)}

//             </pre>

//         </div>

//     );

// };

// export default DeliveryTracking;











import { useEffect, useState } from "react";
import {
  CheckCircle,
  Circle,
  MapPin,
  Clock,
  Truck,
} from "lucide-react";

import { getDeliveryTracking } from "../api/deliveryApi";

const DeliveryTracking = ({ orderId }) => {
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    fetchDelivery();
  }, [orderId]);

  const fetchDelivery = async () => {
    try {
      const response = await getDeliveryTracking(orderId);

      setDelivery(response.data.results[0]);
      console.log(response.data.results[0]);
    } catch (error) {
      console.log(error);
    }
  };
//   const getStep = () => {

//     switch (delivery.status) {

//         case "PENDING":
//             return 1;

//         case "ASSIGNED":
//             return 2;

//         case "PICKED_UP":
//             return 3;

//         case "OUT_FOR_DELIVERY":
//             return 4;

//         case "DELIVERED":
//             return 5;

//         default:
//             return 1;
//     }

// };

// const currentStep = getStep();

// const steps = [
//     "Order Confirmed",
//     "Rider Assigned",
//     "Picked Up",
//     "Out For Delivery",
//     "Delivered",
// ];

  if (!delivery) {
    return (
      <div className="mt-6 bg-white rounded-2xl shadow border p-6">
        <p className="text-gray-500 animate-pulse">
          Loading Delivery...
        </p>
      </div>
    );
  }

  const steps = [
    {
      key: "PENDING",
      label: "Order Confirmed",
    },
    {
      key: "ASSIGNED",
      label: "Rider Assigned",
    },
    {
      key: "PICKED_UP",
      label: "Picked Up",
    },
    {
      key: "OUT_FOR_DELIVERY",
      label: "Out For Delivery",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
    },
  ];

  const currentStep = steps.findIndex(
    (step) => step.key === delivery.status
  );

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg border p-6">

      {/* Header */}

      <div className="flex items-center gap-3 mb-6">
        <Truck className="text-green-600" size={28} />
        <h2 className="text-2xl font-bold">
          Delivery Tracking
        </h2>
      </div>

      {/* Timeline */}

      <div className="space-y-5">



       {steps.map((step, index) => (

  <div
    key={step.key}
    className="relative flex items-start gap-4 pb-8"
  >

    {/* Vertical Line */}

    {index !== steps.length - 1 && (

      <div
        className={`
          absolute
          left-[10px]
          top-6
          w-[2px]
          h-full

          ${
            index < currentStep
              ? "bg-green-500"
              : "bg-gray-300"
          }
        `}
      />

    )}

    {/* Circle */}

    <div className="z-10 bg-white">

      {index <= currentStep ? (

        <CheckCircle
          size={22}
          className="text-green-600"
        />

      ) : (

        <Circle
          size={22}
          className="text-gray-300"
        />

      )}

    </div>

    {/* Label */}

    <div>

      <p
        className={`
          font-semibold

          ${
            index <= currentStep
              ? "text-green-700"
              : "text-gray-500"
          }
        `}
      >

        {step.label}

      </p>

    </div>

  </div>

))} 

      </div>

      {/* Divider */}

      <div className="border-t my-6"></div>

      {/* Status */}

      <div className="space-y-4">

        <div className="flex items-center gap-3">

          <Truck
            size={18}
            className="text-blue-600"
          />

          <span className="font-semibold">
            Current Status:
          </span>

          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
            {delivery.status.replaceAll("_", " ")}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <MapPin
            size={18}
            className="text-red-500"
          />

          <span className="font-semibold">
            Current Location:
          </span>

          <span className="text-gray-700">

            {delivery.current_location ||
              "Location not updated"}

          </span>

        </div>

        <div className="flex items-center gap-3">

          <Clock
            size={18}
            className="text-yellow-600"
          />

          <span className="font-semibold">
            Estimated Delivery:
          </span>

          <span className="text-gray-700">

            {delivery.estimated_delivery_time
              ? new Date(
                  delivery.estimated_delivery_time
                ).toLocaleString()
              : "Updating..."}

          </span>

        </div>

      </div>

      {/* Rider */}

      {/* {delivery.rider_name && (

        <>
          <div className="border-t my-6"></div>

          <h3 className="text-xl font-bold mb-4">
            Assigned Rider
          </h3>

          <div className="flex items-center gap-4">

            <img
              src={delivery.rider_image}
              alt={delivery.rider_name}
              className="w-16 h-16 rounded-full object-cover border"
            />

            <div>

              <h4 className="font-bold">
                {delivery.rider_name}
              </h4>

              <p className="text-gray-600">
                {delivery.rider_vehicle}
              </p>

              <p className="text-gray-600">
                {delivery.rider_phone}
              </p>

              <p className="text-yellow-500">
                ⭐ {delivery.rider_rating}
              </p>

            </div>

          </div>
        </>
      )} */}
      {/* Rider Information */}

{delivery.rider_name && (
  <>
    <div className="border-t my-6"></div>

    <h3 className="text-xl font-bold mb-5">
      Assigned Rider
    </h3>

    <div className="bg-gray-50 rounded-2xl p-5 border">

      <div className="flex items-center gap-5">

        <img
          src={
            delivery.rider_image ||
            "https://ui-avatars.com/api/?name=Rider"
          }
          alt={delivery.rider_name}
          className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
        />

        <div className="flex-1">

          <h4 className="text-xl font-bold">
            {delivery.rider_name}
          </h4>

          <p className="text-gray-500 mt-1">
            📧 {delivery.rider_email}
          </p>

          <p className="text-gray-500">
            📞 {delivery.rider_phone}
          </p>

          <p className="text-gray-500">
            🛵 {delivery.rider_vehicle}
          </p>

          <p className="text-yellow-500 font-semibold mt-1">
            ⭐ {delivery.rider_rating}
          </p>

        </div>

      </div>

    </div>
  </>
)}

    </div>
  );
};

export default DeliveryTracking;