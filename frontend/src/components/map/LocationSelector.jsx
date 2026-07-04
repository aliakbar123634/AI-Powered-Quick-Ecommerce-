import { useMapEvents } from "react-leaflet";
import reverseGeocode from "../../services/location/reverseGeocode";

const LocationSelector = ({ setPosition, setAddress }) => {

    useMapEvents({

        async click(e) {

            const { lat, lng } = e.latlng;

            setPosition([lat, lng]);

            // Call reverse geocoding to get address details
            const address = await reverseGeocode(
                lat,
                lng
            );

            setAddress(address);

        },

    });

    return null;
};

export default LocationSelector;