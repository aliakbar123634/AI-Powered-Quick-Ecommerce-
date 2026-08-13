from django.db import models
from products.models import Product



class Warehouse(models.Model):
    name = models.CharField(max_length=255)

    city = models.CharField(max_length=255)
    area = models.CharField(max_length=255)

    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Inventory(models.Model):
    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(default=0)

    reorder_level = models.PositiveIntegerField(default=10)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("warehouse", "product")





#    python manage.py makemigrations inventory
#     python manage.py migrate inventory