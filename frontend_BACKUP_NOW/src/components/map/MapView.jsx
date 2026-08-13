import { useState , useEffect} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import CurrentLocation from "./CurrentLocation";
import LocationSelector from "./LocationSelector";
import SelectedAddress from "./SelectedAddress";
import AddressSearch from "./AddressSearch";
import MapFlyTo from "./MapFlyTo";
import SaveAddress from "./SaveAddress";

const MapView = () => {

  const [position, setPosition] = useState([
    29.3956,
    71.6836,
  ]);
  const [address, setAddress] = useState(null);
//   useEffect(() => {

//     setAddress({

//         display_name:
//             "Model Town, Bahawalpur, Punjab, Pakistan",

//         address: {

//             city: "Bahawalpur",

//             state: "Punjab",

//             country: "Pakistan",

//             postcode: "63100",

//         },

//     });

// }, []);

  return (
    <>

      <AddressSearch     setPosition={setPosition}  setAddress={setAddress}/>   
      <MapContainer
        className="z-0"
        center={position}
        zoom={13}
        style={{
          height: "500px",
          width: "100%",
        }}
      >
      <CurrentLocation setPosition={setPosition} />
      <LocationSelector setPosition={setPosition}  setAddress={setAddress}/>
      <MapFlyTo position={position} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            Your Current Location
          </Popup>
        </Marker>

      </MapContainer>
      <SelectedAddress  address={address} />
      <SaveAddress address={address} position={position} />

    </>
  );
};

export default MapView;