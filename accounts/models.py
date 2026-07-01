from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser , BaseUserManager 
import uuid
# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required ...")
        email=self.normalize_email(email)
        user=self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class CustomUserModel(AbstractUser):
    role=(
        ('CUSTOMER' , 'CUSTOMER'),
        ('RIDER' , 'RIDER'),
        ('ADMIN' , 'ADMIN'),
    )  
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False) 
    email=models.EmailField(unique=True)
    role=models.CharField(max_length=30 , choices=role, default='CUSTOMER')
    name=models.CharField(max_length=100)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    is_active=models.BooleanField(default=True)
    phone_number=models.CharField(max_length=15 , blank=True, null=True , unique=True)
    profile_image = models.ImageField( upload_to="profiles/", blank=True, null=True )
    bio = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    username=None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []    
    objects=CustomUserManager()
    def __str__(self):
        return self.email
        

class Address(models.Model):
    user = models.ForeignKey(
        CustomUserModel,
        on_delete=models.CASCADE,
        related_name="addresses"
    )

    title = models.CharField(max_length=100)

    city = models.CharField(max_length=100)
    area = models.CharField(max_length=100)

    street = models.TextField()

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    is_default = models.BooleanField(default=False)
    formatted_address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)   # add this

    def __str__(self):
        return f"{self.title} - {self.user.email}"   


class RiderProfile(models.Model):

    class VehicleType(models.TextChoices):
        BIKE = "BIKE", "Bike"
        CYCLE = "CYCLE", "Cycle"
        CAR = "CAR", "Car"

    user = models.OneToOneField(
        CustomUserModel,
        on_delete=models.CASCADE,
        related_name="rider_profile"
    )

    vehicle_type = models.CharField(
        max_length=20,
        choices=VehicleType.choices
    )

    availability_status = models.BooleanField(default=True)

    current_latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    current_longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )

    rating = models.FloatField(default=0)

    def __str__(self):
        return self.user.email    




#       python manage.py makemigrations accounts
#       python manage.py migrate accounts    
#       python manage.py runserver