

import { useEffect } from "react";

const CurrentLocation = ({ setPosition }) => {

  useEffect(() => {

    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {


        setPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);

      },

      (error) => {


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