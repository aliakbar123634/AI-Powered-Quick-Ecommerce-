import { useState } from "react";
import { createAddress } from "../../api/addressApi";

const SaveAddress = ({ address, position }) => {

    const [label, setLabel] = useState("Home");

    const handleSave = async () => {

        if (!address) {
            alert("Please select address first");
            return;
        }


        try {
            const payload = {

    title: label,

    label: label,


    city:
        address.address?.city ||
        address.address?.town ||
        address.address?.village ||
        "",
    area:
        address.address?.suburb ||
        address.address?.neighbourhood ||
        address.address?.county ||
        address.address?.state_district ||
        address.address?.city ||
        "Unknown",


    street:
        address.address?.road ||
        address.address?.quarter ||
        address.display_name,


    country:
        address.address?.country ||
        "",


    state:
        address.address?.state ||
        "",


    postal_code:
        address.address?.postcode ||
        "",

    latitude: Number(position[0].toFixed(6)),

    longitude: Number(position[1].toFixed(6)),


    formatted_address:
        address.display_name,

};

            const response =
                await createAddress(payload);


            console.log(response.data);


            alert(
                "Address Saved Successfully"
            );


        } catch (error) {
        console.log(
           error.response.data
        );

        alert(error.response.data);
        }
   };


    return (

        <div
            className="
            mt-5
            bg-white
            p-5
            rounded-2xl
            border
            shadow-sm
            "
        >

            <h3 className="font-bold text-xl mb-4">
                Save Address
            </h3>


            <select

                value={label}

                onChange={(e)=>
                    setLabel(e.target.value)
                }

                className="
                border
                rounded-xl
                px-4
                py-3
                w-full
                mb-4
                "

            >

                <option>
                    Home
                </option>

                <option>
                    Office
                </option>

                <option>
                    Other
                </option>

            </select>


            <button

                onClick={handleSave}

                className="
                bg-green-600
                text-white
                px-6
                py-3
                rounded-xl
                "

            >

                Save Address

            </button>


        </div>

    );

};


export default SaveAddress;