from django.db import models
from django.utils.text import slugify

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True , blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/' , blank=True , null=True)

    def __str__(self):
        return self.name

    def save(self , *args , **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug=base_slug
            counter=1
        
            while Category.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}" 
                counter += 1  
            self.slug=slug
        super().save(*args , **kwargs)    
    
class Product(models.Model):
    category = models.ForeignKey(
        'Category',
        on_delete=models.CASCADE,
        related_name='products'
    )

    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)

    description = models.TextField(blank=True, null=True)

    brand = models.CharField(max_length=255, blank=True, null=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    image = models.ImageField(upload_to='products/' , blank=True , null=True)

    weight = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    unit = models.CharField(max_length=50 , blank=True, null=True)

    stock_status = models.BooleanField(default=True )

    is_active = models.BooleanField(default=True)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    def save(self , *args , **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug=base_slug
            counter=1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}" 
                counter += 1  
            self.slug=slug
        super().save(*args , **kwargs)    


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/' , blank=True , null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.product.name} Image"
    


class Review(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    name = models.CharField(max_length=100)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.product.name} - {self.rating}"    

#                python manage.py makemigrations products
#                python manage.py migrate products