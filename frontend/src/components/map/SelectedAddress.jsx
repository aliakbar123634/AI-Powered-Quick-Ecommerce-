const SelectedAddress = ({ address }) => {
    console.log(address);
    return (

        <div
            className="
                mt-6
                bg-white
                rounded-2xl
                border
                border-slate-200
                shadow-sm
                p-5
            "
        >

            <h3
                className="
                    text-lg
                    font-semibold
                    text-slate-800
                    mb-4
                "
            >
                📍 Selected Address
            </h3>

            {address ? (

                <div className="space-y-2">

                    <p className="text-slate-700">
                        <span className="font-semibold">
                            Full Address:
                        </span>
                    </p>

                    <p className="text-slate-600">
                        {address.display_name}
                    </p>

                    <hr className="my-4" />

                    <div className="grid grid-cols-2 gap-3">

                        <div>
                            <span className="font-semibold">
                                City
                            </span>

                            <p>
                                {address.address?.city ||
                                    address.address?.town ||
                                    address.address?.village ||
                                    "-"}
                            </p>
                        </div>

                        <div>
                            <span className="font-semibold">
                                State
                            </span>

                            <p>
                                {address.address?.state || "-"}
                            </p>
                        </div>

                        <div>
                            <span className="font-semibold">
                                Country
                            </span>

                            <p>
                                {address.address?.country || "-"}
                            </p>
                        </div>

                        <div>
                            <span className="font-semibold">
                                Post Code
                            </span>

                            <p>
                                {address.address?.postcode || "-"}
                            </p>
                        </div>

                    </div>

                </div>

            ) : (

                <p className="text-slate-500">

                    Click anywhere on the map to select an address.

                </p>

            )}

        </div>

    );

};

export default SelectedAddress;