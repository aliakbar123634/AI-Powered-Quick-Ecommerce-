const searchLocation = async (query) => {

    if (!query.trim()) {
        return [];
    }

    try {

        const response = await fetch(

            `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5`,

            {
                headers: {
                    Accept: "application/json",
                },
            }

        );

        const data = await response.json();

        return data;

    } catch (error) {

        console.log(error);

        return [];

    }

};

export default searchLocation;