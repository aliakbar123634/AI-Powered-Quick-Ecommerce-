
import { useNavigate } from "react-router-dom";

const CheckoutAddress = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
}) => {

  const navigate = useNavigate();


  return (

    <div
      className="
        bg-white
        rounded-xl
        shadow
        p-6
        mb-6
      "
    >

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold">
          Delivery Address
        </h2>


        <button

          onClick={() => navigate("/location")}

          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
          "

        >

          Add Address

        </button>


      </div>


      {
        addresses.length === 0 ? (

          <p className="text-gray-500">

            No address found. Add your address.

          </p>


        ) : (


          <div className="space-y-4">


            {


              addresses.map((address) => (


                <div

                  key={address.id}


                  onClick={() =>
                    setSelectedAddress(address)
                  }


                  className={`
                    
                    border
                    rounded-xl
                    p-4
                    cursor-pointer

                    ${
                      selectedAddress?.id === address.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }

                  `}

                >


                  <div className="flex gap-3">


                    <input

                      type="radio"

                      checked={
                        selectedAddress?.id === address.id
                      }

                      onChange={() =>
                        setSelectedAddress(address)
                      }

                    />


                    <div>


                      <div className="flex gap-3 items-center">


                        <h3 className="font-bold">

                          {address.label}

                        </h3>


                        {
                          address.is_default && (

                            <span
                              className="
                                text-xs
                                bg-green-100
                                text-green-700
                                px-2
                                py-1
                                rounded
                              "
                            >

                              Default

                            </span>

                          )
                        }


                      </div>



                      <p className="text-gray-600 mt-2">

                        {address.formatted_address}

                      </p>



                      <p className="text-sm text-gray-500 mt-1">

                        {address.city},
                        {" "}
                        {address.state},
                        {" "}
                        {address.country}

                      </p>


                    </div>


                  </div>


                </div>


              ))

            }


          </div>


        )
      }


    </div>

  );

};


export default CheckoutAddress;