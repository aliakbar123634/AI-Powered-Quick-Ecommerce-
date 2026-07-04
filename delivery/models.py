from django.db import models
from orders.models import Order


class DeliveryTracking(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="tracking_history"
    )

    status = models.CharField(max_length=100)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    timestamp = models.DateTimeField(auto_now_add=True)



#    python manage.py makemigrations delivery
#    python manage.py migrate