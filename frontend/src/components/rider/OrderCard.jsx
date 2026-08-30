import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
    CalendarDays,
    Eye,
    Package,
    MapPin,
    Truck,
    PackageCheck,
    AlertCircle,
} from "lucide-react";

import {
    pickedUpOrder,
    outForDeliveryOrder,
    deliveredOrder,
} from "../../api/riderApi";

import ConfirmActionModal from "./ConfirmActionModal";


const OrderCard = ({ order, onRefresh }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);


    // ============================================================
    // STATUS COLOR
    // ============================================================

    const getStatusColor = (status) => {

        switch (status) {

            case "DELIVERED":
                return "bg-green-100 text-green-700";

            case "CONFIRMED":
                return "bg-blue-100 text-blue-700";

            case "OUT_FOR_DELIVERY":
                return "bg-purple-100 text-purple-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };


    // ============================================================
    // STATUS LABEL
    // ============================================================

    const getStatusLabel = (status) => {

        switch (status) {

            case "OUT_FOR_DELIVERY":
                return "Out For Delivery";

            case "DELIVERED":
                return "Delivered";

            case "CANCELLED":
                return "Cancelled";

            case "CONFIRMED":
                return "Confirmed";

            default:
                return status?.replaceAll("_", " ") || "Unknown";
        }
    };


    // ============================================================
    // ACTION LABEL
    // ============================================================

    const getActionLabel = (action) => {

        switch (action) {

            case "picked-up":
                return "mark this order as Picked Up";

            case "out-for-delivery":
                return "mark this order as Out For Delivery";

            case "delivered":
                return "mark this order as Delivered";

            default:
                return "perform this action";
        }
    };


    // ============================================================
    // OPEN CONFIRMATION
    // ============================================================

    const openConfirmation = (action) => {

        setSelectedAction(action);
        setOpenModal(true);
    };


    // ============================================================
    // RIDER ACTION
    // ============================================================

    const handleAction = async () => {

        if (!order.delivery_id) {

            setError(
                "Delivery ID is missing for this order."
            );

            return;
        }


        try {

            setLoading(true);
            setError("");


            // ====================================================
            // ASSIGNED → PICKED UP
            // ====================================================

            if (selectedAction === "picked-up") {

                await pickedUpOrder(
                    order.delivery_id
                );
            }


            // ====================================================
            // PICKED UP → OUT FOR DELIVERY
            // ====================================================

            else if (
                selectedAction === "out-for-delivery"
            ) {

                await outForDeliveryOrder(
                    order.delivery_id
                );
            }


            // ====================================================
            // OUT FOR DELIVERY → DELIVERED
            // ====================================================

            else if (
                selectedAction === "delivered"
            ) {

                await deliveredOrder(
                    order.delivery_id
                );
            }


            // Close modal

            setOpenModal(false);
            setSelectedAction(null);


            // Refresh orders

            if (onRefresh) {

                await onRefresh();
            }

        } catch (err) {

            console.error(
                "Rider action error:",
                err
            );


            const message =
                err.response?.data?.error ||
                err.response?.data?.detail ||
                "Something went wrong. Please try again.";


            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // ACTION BUTTON
    // ============================================================

    const renderActionButton = () => {


        // ========================================================
        // ASSIGNED → PICKED UP
        // ========================================================

        if (
            order.delivery_status === "ASSIGNED"
        ) {

            return (

                <button
                    onClick={() =>
                        openConfirmation("picked-up")
                    }
                    disabled={loading}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-blue-600
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        hover:bg-blue-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition
                    "
                >

                    <Package size={18} />

                    {loading
                        ? "Processing..."
                        : "Picked Up"
                    }

                </button>
            );
        }


        // ========================================================
        // PICKED UP → OUT FOR DELIVERY
        // ========================================================

        if (
            order.delivery_status === "PICKED_UP"
        ) {

            return (

                <button
                    onClick={() =>
                        openConfirmation(
                            "out-for-delivery"
                        )
                    }
                    disabled={loading}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-purple-600
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        hover:bg-purple-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition
                    "
                >

                    <Truck size={18} />

                    {loading
                        ? "Processing..."
                        : "Out For Delivery"
                    }

                </button>
            );
        }


        // ========================================================
        // OUT FOR DELIVERY → DELIVERED
        // ========================================================

        if (
            order.delivery_status === "OUT_FOR_DELIVERY"
        ) {

            return (

                <button
                    onClick={() =>
                        openConfirmation("delivered")
                    }
                    disabled={loading}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-green-600
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        hover:bg-green-700
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        transition
                    "
                >

                    <PackageCheck size={18} />

                    {loading
                        ? "Processing..."
                        : "Mark Delivered"
                    }

                </button>
            );
        }


        // ========================================================
        // DELIVERED
        // ========================================================

        if (
            order.delivery_status === "DELIVERED"
        ) {

            return (

                <button
                    disabled
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-green-100
                        text-green-700
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        cursor-not-allowed
                    "
                >

                    <PackageCheck size={18} />

                    Delivered ✓

                </button>
            );
        }


        return null;
    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <div
            className="
                bg-white
                rounded-3xl
                border
                border-gray-200
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
                p-6
            "
        >


            {/* ====================================================
                HEADER
            ==================================================== */}

            <div
                className="
                    flex
                    justify-between
                    items-start
                    gap-5
                "
            >

                <div>

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-gray-900
                        "
                    >
                        #{order.order_number}
                    </h2>


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-gray-500
                            mt-2
                        "
                    >

                        <CalendarDays size={18} />

                        <span>
                            {new Date(
                                order.created_at
                            ).toLocaleDateString()}
                        </span>

                    </div>

                </div>


                <span
                    className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        ${getStatusColor(
                            order.status
                        )}
                    `}
                >
                    {getStatusLabel(
                        order.status
                    )}
                </span>

            </div>


            {/* ====================================================
                DETAILS
            ==================================================== */}

            <div
                className="
                    grid
                    md:grid-cols-3
                    gap-6
                    mt-8
                "
            >


                {/* CUSTOMER */}

                <div>

                    <p className="text-gray-500">
                        Customer
                    </p>

                    <p className="font-semibold mt-2">
                        {order.customer_name || "Customer"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                        {order.customer_phone || "No phone"}
                    </p>

                </div>


                {/* TOTAL */}

                <div>

                    <p className="text-gray-500">
                        Total Amount
                    </p>

                    <h3
                        className="
                            text-xl
                            font-bold
                            text-green-600
                            mt-2
                        "
                    >
                        Rs {order.total_price}
                    </h3>

                </div>


                {/* DELIVERY */}

                <div>

                    <div
                        className="
                            flex
                            gap-2
                            items-center
                            text-gray-500
                        "
                    >

                        <MapPin size={18} />

                        <span>
                            Delivery
                        </span>

                    </div>


                    <p
                        className="
                            mt-2
                            text-sm
                            text-gray-600
                        "
                    >
                        Delivery information
                    </p>

                </div>

            </div>


            {/* ====================================================
                ERROR
            ==================================================== */}

            {error && (

                <div
                    className="
                        mt-6
                        flex
                        items-center
                        gap-3
                        bg-red-50
                        border
                        border-red-200
                        text-red-700
                        px-4
                        py-3
                        rounded-xl
                        text-sm
                    "
                >

                    <AlertCircle size={18} />

                    <span>
                        {error}
                    </span>

                </div>
            )}


            {/* ====================================================
                ACTIONS
            ==================================================== */}

            <div
                className="
                    flex
                    flex-wrap
                    justify-end
                    gap-3
                    mt-8
                "
            >

                {renderActionButton()}


                {/* VIEW DETAILS */}

                {/* <Link
                    to={`/orders/${order.id}`}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-gray-900
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        hover:bg-black
                        transition
                    "
                > */}
                <Link
    to={`/rider/orders/${order.id}`}
    className="
        flex
        items-center
        gap-2
        bg-gray-900
        text-white
        px-6
        py-3
        rounded-xl
        hover:bg-black
        transition
    "
>
    <Eye size={18} />

    View Details
</Link>
            </div>


            {/* ====================================================
                CONFIRM MODAL
            ==================================================== */}

            <ConfirmActionModal

                isOpen={openModal}

                title="Confirm Action"

                message={
                    selectedAction
                        ? `Are you sure you want to ${getActionLabel(
                              selectedAction
                          )}?`
                        : ""
                }

                onCancel={() => {

                    if (!loading) {

                        setOpenModal(false);
                        setSelectedAction(null);
                    }

                }}

                onConfirm={handleAction}

            />

        </div>
    );
};


export default OrderCard;