import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";

import Navbar from "../components/Navbar";
import { getOrderByStripeSession } from "../api/orderApi";

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();

    const sessionId = searchParams.get("session_id");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            if (!sessionId) {
                setError("Stripe session ID is missing.");
                setLoading(false);
                return;
            }

            try {
                const response = await getOrderByStripeSession(sessionId);

                setOrder(response.data.order);
            } catch (error) {
                console.error("Order Success Error:", error);

                setError(
                    error.response?.data?.error ||
                    "Unable to find your order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [sessionId]);


    if (loading) {
        return (
            <>
                <Navbar />

                <div className="min-h-[70vh] flex flex-col items-center justify-center">

                    <Loader2
                        size={45}
                        className="animate-spin text-blue-600"
                    />

                    <h2 className="text-2xl font-bold mt-5">
                        Confirming Your Order...
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Please wait while we retrieve your order.
                    </p>

                </div>
            </>
        );
    }


    if (error || !order) {
        return (
            <>
                <Navbar />

                <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">

                    <h2 className="text-3xl font-bold text-red-600">
                        Order Not Found
                    </h2>

                    <p className="text-gray-500 mt-3 text-center">
                        {error || "We could not find your order."}
                    </p>

                    <Link
                        to="/products"
                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
                    >
                        Continue Shopping
                    </Link>

                </div>
            </>
        );
    }


    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 px-6 py-12">

                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">

                    {/* SUCCESS HEADER */}

                    <div className="text-center">

                        <CheckCircle
                            size={90}
                            className="text-green-600 mx-auto"
                        />

                        <h1 className="text-4xl font-bold mt-5">
                            Order Placed Successfully!
                        </h1>

                        <p className="text-gray-500 mt-3">
                            Thank you for your purchase.
                        </p>

                    </div>


                    {/* ORDER INFO */}

                    <div className="grid md:grid-cols-2 gap-6 mt-10">

                        <div className="border rounded-2xl p-5">

                            <h2 className="font-bold text-xl mb-4">
                                Order Information
                            </h2>

                            <p>
                                Order No:
                                <b className="ml-2">
                                    {order.order_number}
                                </b>
                            </p>

                            <p className="mt-4">

                                Status:

                                <span className="
                                    ml-2
                                    bg-green-100
                                    text-green-700
                                    px-3
                                    py-1
                                    rounded-full
                                    text-sm
                                ">
                                    {order.status}
                                </span>

                            </p>

                        </div>


                        {/* DELIVERY ADDRESS */}

                        <div className="border rounded-2xl p-5">

                            <h2 className="font-bold text-xl mb-4">
                                Delivery Address
                            </h2>

                            <p className="text-gray-600">
                                {order.delivery_address}
                            </p>

                        </div>

                    </div>


                    {/* ORDER ITEMS */}

                    <div className="mt-8 border rounded-2xl p-5">

                        <h2 className="font-bold text-xl mb-5">
                            Ordered Items
                        </h2>


                        {order.items?.map((item) => (

                            <div
                                key={item.id}
                                className="
                                    flex
                                    justify-between
                                    border-b
                                    py-4
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

                        ))}

                    </div>


                    {/* PRICE SUMMARY */}

                    <div className="
                        mt-8
                        max-w-md
                        ml-auto
                        space-y-3
                    ">

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


                        <div className="
                            flex
                            justify-between
                            text-xl
                            font-bold
                        ">

                            <span>Total</span>

                            <span>
                                Rs {order.total_price}
                            </span>

                        </div>

                    </div>


                    {/* BUTTONS */}

                    <div className="
                        flex
                        justify-center
                        gap-5
                        mt-10
                        flex-wrap
                    ">

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