
import { useEffect } from "react";

const CurrentLocation = ({ setPosition }) => {

  useEffect(() => {

    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        console.log("SUCCESS");
        console.log(position);

        setPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);

      },

      (error) => {

        console.log(error);
        console.log(error.code);
        console.log(error.message);

        // alert(error.message);

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

    );

  }, [setPosition]);

  return null;
};

export default CurrentLocation;