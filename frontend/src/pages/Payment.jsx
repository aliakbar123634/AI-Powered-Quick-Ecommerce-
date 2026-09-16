// import React, { useState } from "react";
// import {
//   useLocation,
//   useNavigate
// } from "react-router-dom";

// import {
//   createPayment,
//   stripeCheckout
// } from "../api/orderApi";

// import Navbar from "../components/Navbar";


// const Payment = () => {


// const location = useLocation();

// const navigate = useNavigate();


// const order = location.state?.order;


// const [method,setMethod] = useState("COD");

// const [loading,setLoading] = useState(false);



// if(!order){

// return <h2>No Order Found</h2>

// }
// const handlePayment = async()=>{


// try{


// setLoading(true);


// // create payment

// const paymentResponse = await createPayment({

// order_id: order.id,

// payment_method: method

// });


// const payment = paymentResponse.data;



// // COD

// if(method === "COD"){


// navigate(
// "/order-success",
// {
// state:{
// order: order
// }
// }
// );


// }



// // STRIPE

// if(method === "STRIPE"){


// const stripeResponse = await stripeCheckout(
// payment.id
// );


// window.location.href =
// stripeResponse.data.checkout_url;


// }



// }catch(error){




// if(error.response){

// alert(error.response.data.error)

// }


// }

// finally{

// setLoading(false);

// }


// };




// return (

// <>

// <Navbar />


// <div className="max-w-xl mx-auto mt-20 bg-white shadow-xl rounded-2xl p-8">


// <h1 className="text-3xl font-bold">

// Payment

// </h1>



// <div className="mt-6">


// <label className="block">

// <input

// type="radio"

// checked={method==="COD"}

// onChange={()=>setMethod("COD")}

// />

//  Cash On Delivery

// </label>



// <label className="block mt-4">

// <input

// type="radio"

// checked={method==="STRIPE"}

// onChange={()=>setMethod("STRIPE")}

// />

//  Stripe Card

// </label>


// </div>



// <div className="mt-8">

// <p>
// Order:
// <b>{order.order_number}</b>
// </p>


// <p>
// Amount:
// <b> Rs {order.total_price}</b>
// </p>


// </div>



// <button

// disabled={loading}

// onClick={handlePayment}

// className="
// mt-8
// w-full
// bg-green-600
// text-white
// py-3
// rounded-xl
// "

// >

// {
// loading
// ?
// "Processing..."
// :
// "Pay Now"
// }


// </button>


// </div>

// </>

// );

// };
// export default Payment;










import React, { useState } from "react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    createPayment,
    stripeCheckout
} from "../api/orderApi";

import Navbar from "../components/Navbar";


const Payment = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const order = location.state?.order;

    const [method, setMethod] = useState("COD");
    const [loading, setLoading] = useState(false);


    // ============================
    // NO ORDER
    // ============================

    if (!order) {

        return (
            <>
                <Navbar />

                <div className="min-h-[70vh] flex items-center justify-center">

                    <h2 className="text-2xl font-bold text-red-600">
                        No Order Found
                    </h2>

                </div>
            </>
        );
    }


    // ============================
    // PAYMENT
    // ============================

    const handlePayment = async () => {

        try {

            setLoading(true);


            // ============================
            // CREATE PAYMENT
            // ============================

            const paymentResponse = await createPayment({

                order_id: order.id,

                payment_method: method

            });


            const payment = paymentResponse.data;


            // ============================
            // CASH ON DELIVERY
            // ============================

            if (method === "COD") {

                navigate(
                    `/order-success?order_id=${order.id}`,
                    {
                        replace: true
                    }
                );

                return;
            }


            // ============================
            // STRIPE
            // ============================

            if (method === "STRIPE") {

                const stripeResponse =
                    await stripeCheckout(payment.id);

                window.location.href =
                    stripeResponse.data.checkout_url;

                return;
            }


        } catch (error) {


            alert(
                error.response?.data?.error ||
                "Payment failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <>

            <Navbar />


            <div className="max-w-xl mx-auto mt-20 bg-white shadow-xl rounded-2xl p-8">

                <h1 className="text-3xl font-bold">
                    Payment
                </h1>


                {/* PAYMENT METHODS */}

                <div className="mt-6">

                    <label className="block cursor-pointer">

                        <input
                            type="radio"
                            name="payment_method"
                            checked={method === "COD"}
                            onChange={() => setMethod("COD")}
                        />

                        <span className="ml-2">
                            Cash On Delivery
                        </span>

                    </label>


                    <label className="block mt-4 cursor-pointer">

                        <input
                            type="radio"
                            name="payment_method"
                            checked={method === "STRIPE"}
                            onChange={() => setMethod("STRIPE")}
                        />

                        <span className="ml-2">
                            Stripe Card
                        </span>

                    </label>

                </div>


                {/* ORDER INFO */}

                <div className="mt-8">

                    <p>
                        Order:
                        <b className="ml-2">
                            {order.order_number}
                        </b>
                    </p>


                    <p className="mt-2">

                        Amount:
                        <b className="ml-2">
                            Rs {order.total_price}
                        </b>

                    </p>

                </div>


                {/* BUTTON */}

                <button
                    disabled={loading}
                    onClick={handlePayment}
                    className="
                        mt-8
                        w-full
                        bg-green-600
                        hover:bg-green-700
                        disabled:bg-gray-400
                        text-white
                        py-3
                        rounded-xl
                        font-semibold
                    "
                >

                    {loading
                        ? "Processing..."
                        : method === "COD"
                            ? "Place Order"
                            : "Pay with Stripe"
                    }

                </button>

            </div>

        </>

    );

};


export default Payment;