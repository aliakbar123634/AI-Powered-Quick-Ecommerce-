from django.db import models

from orders.models import Order

from accounts.models import CustomUserModel , RiderProfile



class DeliveryTracking(models.Model):


    class Status(models.TextChoices):

        PENDING = "PENDING"

        ASSIGNED = "ASSIGNED"

        PICKED_UP = "PICKED_UP"

        OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"

        DELIVERED = "DELIVERED"

        FAILED = "FAILED"




    order = models.OneToOneField(

        Order,

        on_delete=models.CASCADE,

        related_name="delivery"

    )



    rider = models.ForeignKey(

        RiderProfile,

        on_delete=models.SET_NULL,

        null=True,

        blank=True

    )




    status = models.CharField(

        max_length=50,

        choices=Status.choices,

        default=Status.PENDING

    )





    current_location = models.CharField(

        max_length=255,

        blank=True,

        null=True

    )




    estimated_delivery_time = models.DateTimeField(

        null=True,

        blank=True

    )




    created_at = models.DateTimeField(

        auto_now_add=True

    )



    updated_at = models.DateTimeField(

        auto_now=True

    )




    def __str__(self):

        return f"{self.order.order_number} - {self.status}"



#    python manage.py makemigrations delivery
#    python manage.py migrate
