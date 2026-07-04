import { useState } from "react";
import searchLocation from "../../services/location/searchLocation";
import reverseGeocode from "../../services/location/reverseGeocode";

const AddressSearch = ({
    setPosition,
    setAddress,
}) => {

    const [query, setQuery] = useState("");

    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {

        const value = e.target.value;

        setQuery(value);

        if (!value.trim()) {

            setResults([]);

            return;

        }

        const data = await searchLocation(value);

        setResults(data);

    };

    // const handleSelect = (place) => {

    //     const latitude = Number(place.lat);

    //     const longitude = Number(place.lon);

    //     setPosition([
    //         latitude,
    //         longitude,
    //     ]);

    //     setAddress(place);

    //     setResults([]);

    //     setQuery(place.display_name);

    // };
const handleSelect = async (place) => {

    const latitude = Number(place.lat);
    const longitude = Number(place.lon);

    setPosition([latitude, longitude]);

    const fullAddress = await reverseGeocode(latitude, longitude);

    setAddress(fullAddress);

    setResults([]);

    setQuery(fullAddress.display_name);
};
    return (

        <div className="relative mb-6">

            <input
                type="text"
                placeholder="Search location..."
                value={query}
                onChange={handleSearch}
                className="
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "
            />

            {

                results.length > 0 && (

                    <div
                        className="
                            absolute
                            left-0
                            right-0
                            mt-2
                            bg-white
                            border
                            rounded-xl
                            shadow-lg
                            max-h-72
                            overflow-y-auto
                            z-50
                        "
                    >

                        {

                            results.map((place) => (

                                <button

                                    key={place.place_id}

                                    onClick={() =>
                                        handleSelect(place)
                                    }

                                    className="
                                        w-full
                                        text-left
                                        px-4
                                        py-3
                                        hover:bg-slate-100
                                        border-b
                                    "

                                >

                                    {place.display_name}

                                </button>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

};

export default AddressSearch;