import math


def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    # Earth radius in KM
    R = 6371


    lat1 = math.radians(float(lat1))
    lon1 = math.radians(float(lon1))

    lat2 = math.radians(float(lat2))
    lon2 = math.radians(float(lon2))


    difference_lat = lat2 - lat1
    difference_lon = lon2 - lon1


    a = (
        math.sin(difference_lat / 2) ** 2
        +
        math.cos(lat1)
        *
        math.cos(lat2)
        *
        math.sin(difference_lon / 2) ** 2
    )


    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )


    distance = R * c


    return round(distance, 2)