import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapFlyTo = ({ position }) => {

    const map = useMap();

    useEffect(() => {

        if (!position) return;

        map.flyTo(position, 15, {
            animate: true,
            duration: 1.5,
        });

    }, [position, map]);

    return null;

};

export default MapFlyTo;