const reverseGeocode = async (latitude, longitude) => {

    try {

        const response = await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,

            {
                headers: {
                    "Accept": "application/json",
                },
            }

        );

        const data = await response.json();

        return data;

    } catch (error) {

        console.log(error);

        return null;

    }

};

export default reverseGeocode;