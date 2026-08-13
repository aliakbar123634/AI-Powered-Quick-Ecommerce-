import OrderCard from "./OrderCard";

const RiderOrderSection = ({
    title,
    orders,
    onRefresh,
}) => {

    if (orders.length === 0) return null;

    return (

        <div className="mt-10">

            <h2 className="text-2xl font-bold mb-5">

                {title}

            </h2>

            <div className="space-y-5">

                {orders.map((order) => (

                    <OrderCard
                        key={order.id}
                        order={order}
                        onRefresh={onRefresh}
                    />

                ))}

            </div>

        </div>

    );

};

export default RiderOrderSection;