const RiderStats = ({
    pending,
    assigned,
    pickedUp,
    outForDelivery,
    delivered,
}) => {

    const stats = [
        {
            title: "Pending",
            value: pending,
            color: "bg-yellow-100 text-yellow-700",
        },
        {
            title: "Assigned",
            value: assigned,
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: "Picked Up",
            value: pickedUp,
            color: "bg-orange-100 text-orange-700",
        },
        {
            title: "Out For Delivery",
            value: outForDelivery,
            color: "bg-purple-100 text-purple-700",
        },
        {
            title: "Delivered",
            value: delivered,
            color: "bg-green-100 text-green-700",
        },
    ];

    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 mt-8">

            {stats.map((item) => (
                <div
                    key={item.title}
                    className={`${item.color} rounded-2xl p-6 shadow`}
                >
                    <h3 className="text-lg font-semibold">
                        {item.title}
                    </h3>

                    <p className="text-4xl font-bold mt-3">
                        {item.value}
                    </p>
                </div>
            ))}

        </div>
    );
};

export default RiderStats;