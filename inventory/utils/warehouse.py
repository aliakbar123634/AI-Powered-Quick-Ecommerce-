from inventory.models import Warehouse
from accounts.utils.distance import calculate_distance


def get_nearest_warehouse(customer_latitude, customer_longitude):
    nearest_warehouse = None
    shortest_distance = None

    warehouses = Warehouse.objects.filter(
        is_active=True
    )

    for warehouse in warehouses:
        distance = calculate_distance(
            warehouse.latitude,
            warehouse.longitude,
            customer_latitude,
            customer_longitude
        )

        if distance <= warehouse.service_radius_km:
            if shortest_distance is None or distance < shortest_distance:
                shortest_distance = distance
                nearest_warehouse = warehouse

    return nearest_warehouse