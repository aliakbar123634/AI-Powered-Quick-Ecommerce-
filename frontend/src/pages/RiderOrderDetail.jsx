import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRiderOrderDetail } from "../api/riderApi";

const RiderOrderDetail = () => {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchOrder = async () => {

            try {

                const response = await getRiderOrderDetail(id);

                console.log("RIDER ORDER DETAIL:", response.data);

                setOrder(response.data);

            } catch (error) {

                console.error(
                    "Rider order detail error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchOrder();

    }, [id]);


    if (loading) {
        return <h2>Loading...</h2>;
    }


    if (!order) {
        return <h2>Order Not Found</h2>;
    }


    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Order Details
                </h1>

                <div className="bg-white rounded-2xl shadow p-8">

                    <h2 className="text-2xl font-bold mb-6">
                        #{order.order_number}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-gray-500">
                                Order Status
                            </p>

                            <p className="font-semibold mt-1">
                                {order.status}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                Delivery Status
                            </p>

                            <p className="font-semibold mt-1">
                                {order.delivery_status}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                Total Amount
                            </p>

                            <p className="font-semibold mt-1">
                                Rs {order.total_price}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-500">
                                Delivery City
                            </p>

                            <p className="font-semibold mt-1">
                                {order.delivery_city}
                            </p>
                        </div>

                    </div>


                    <div className="mt-8">

                        <p className="text-gray-500">
                            Delivery Address
                        </p>

                        <p className="font-semibold mt-1">
                            {order.delivery_address}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default RiderOrderDetail;