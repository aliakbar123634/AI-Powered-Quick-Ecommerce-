import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";


const OrderSuccess = () => {


    const location = useLocation();


    const order = location.state?.order;



    if (!order) {

        return (

            <>

                <Navbar />


                <div className="min-h-[70vh] flex items-center justify-center">


                    <h2 className="text-2xl font-bold">

                        No Order Found

                    </h2>


                </div>


            </>

        );

    }




    return (

        <>

            <Navbar />



            <div
                className="
                min-h-screen
                bg-gray-50
                px-6
                py-12
                "
            >


                <div
                    className="
                    max-w-5xl
                    mx-auto
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-8
                    "
                >


                    {/* Success Header */}

                    <div className="text-center">


                        <CheckCircle

                            size={90}

                            className="
                            text-green-600
                            mx-auto
                            "

                        />



                        <h1
                            className="
                            text-4xl
                            font-bold
                            mt-5
                            "
                        >

                            Order Placed Successfully!


                        </h1>



                        <p
                            className="
                            text-gray-500
                            mt-3
                            "
                        >

                            Thank you for your purchase.


                        </p>


                    </div>



                    {/* Order Info */}


                    <div
                        className="
                        grid
                        md:grid-cols-2
                        gap-6
                        mt-10
                        "
                    >


                        <div
                            className="
                            border
                            rounded-2xl
                            p-5
                            "
                        >


                            <h2 className="font-bold text-xl mb-4">

                                Order Information

                            </h2>



                            <p>

                                Order No:

                                <b>
                                    {" "}
                                    {order.order_number}
                                </b>


                            </p>



                            <p className="mt-3">

                                Status:

                                <span
                                    className="
                                    ml-2
                                    bg-yellow-100
                                    text-yellow-700
                                    px-3
                                    py-1
                                    rounded-full
                                    text-sm
                                    "
                                >

                                    {order.status}


                                </span>


                            </p>


                        </div>



                        {/* Address */}


                        <div
                            className="
                            border
                            rounded-2xl
                            p-5
                            "
                        >


                            <h2 className="font-bold text-xl mb-4">

                                Delivery Address

                            </h2>



                            <p className="text-gray-600">

                                {order.delivery_address}

                            </p>



                        </div>


                    </div>



                    {/* Items */}


                    <div
                        className="
                        mt-8
                        border
                        rounded-2xl
                        p-5
                        "
                    >


                        <h2 className="font-bold text-xl mb-5">

                            Ordered Items

                        </h2>



                        {
                            order.items.map((item) => (


                                <div

                                    key={item.id}

                                    className="
                                    flex
                                    justify-between
                                    border-b
                                    py-3
                                    "

                                >


                                    <div>


                                        <h3 className="font-semibold">

                                            {item.product_name}

                                        </h3>


                                        <p className="text-gray-500">

                                            Qty: {item.quantity}

                                        </p>


                                    </div>



                                    <p className="font-bold">

                                        Rs {item.subtotal}

                                    </p>



                                </div>


                            ))

                        }



                    </div>



                    {/* Price Summary */}


                    <div
                        className="
                        mt-8
                        max-w-md
                        ml-auto
                        space-y-3
                        "
                    >


                        <div className="flex justify-between">

                            <span>Subtotal</span>

                            <b>
                                Rs {order.subtotal}
                            </b>

                        </div>


                        <div className="flex justify-between">

                            <span>Delivery Fee</span>

                            <b>
                                Rs {order.delivery_fee}
                            </b>

                        </div>



                        <div className="flex justify-between">

                            <span>Discount</span>

                            <b>
                                Rs {order.discount}
                            </b>

                        </div>


                        <hr />



                        <div
                            className="
                            flex
                            justify-between
                            text-xl
                            font-bold
                            "
                        >

                            <span>Total</span>


                            <span>

                                Rs {order.total_price}

                            </span>


                        </div>


                    </div>



                    {/* Buttons */}


                    <div
                        className="
                        flex
                        justify-center
                        gap-5
                        mt-10
                        "
                    >


                        <Link

                            to="/products"

                            className="
                            bg-gray-900
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            "

                        >

                            Continue Shopping


                        </Link>



                        <Link

                            to="/orders"

                            className="
                            bg-green-600
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            "

                        >

                            View Orders


                        </Link>



                    </div>




                </div>


            </div>


        </>

    );

};


export default OrderSuccess;