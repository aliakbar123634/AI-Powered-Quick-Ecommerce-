from django.db import models
from accounts.models import CustomUserModel , RiderProfile , Address
from products.models import Product
from inventory.models import Warehouse
import uuid

# Create your models here.

class Cart(models.Model):
    user = models.OneToOneField(
        CustomUserModel,
        on_delete=models.CASCADE,
        related_name='cart'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart - {self.user.username}"
    
class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='cart_items'
    )

    quantity = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"    
    

class Order(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("OUT_FOR_DELIVERY", "Out for Delivery"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    user = models.ForeignKey(
        CustomUserModel, 
        on_delete=models.CASCADE,
        related_name="orders"
    )
    Warehouse=models.ForeignKey(
        Warehouse,
        on_delete=models.CASCADE,
        related_name="orders" ,
        null=True,
        blank=True       
    )
    rider=models.ForeignKey(
        RiderProfile,
        on_delete=models.CASCADE,
        related_name="orders" ,  
        null=True,
        blank=True     
    )
    address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        null=True
    )
    order_number = models.CharField(
        max_length=100,
        unique=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
  
    total_price = models.DecimalField(
        max_digits=18,
        decimal_places=2
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        if not self.order_number:
            self.order_number = f"ORD-{uuid.uuid4().hex[:8].upper()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.id} - {self.user}"


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="order_items"
    )

    quantity = models.PositiveIntegerField(default=1)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    



class Payment(models.Model):

    class Method(models.TextChoices):
        COD = "COD"
        STRIPE = "STRIPE"
        EASYPAISA = "EASYPAISA"
        JAZZCASH = "JAZZCASH"

    class Status(models.TextChoices):
        PENDING = "PENDING"
        PAID = "PAID"
        FAILED = "FAILED"

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_method = models.CharField(
        max_length=20,
        choices=Method.choices
    )

    payment_status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)    
    

#    python manage.py makemigrations orders
#    python manage.py migrate orders
    