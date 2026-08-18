from django.db import models
from accounts.models import CustomUserModel
from products.models import Product, Category
from pgvector.django import VectorField

class SearchHistory(models.Model):
    user = models.ForeignKey(
        CustomUserModel,
        on_delete=models.CASCADE
    )
    search_query = models.CharField(max_length=255)
    searched_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-searched_at"]
    def __str__(self):
        return f"{self.user.email} - {self.search_query}"

class UserPreference(models.Model):
    user = models.ForeignKey(
        CustomUserModel,
        on_delete=models.CASCADE
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE
    )
    score = models.FloatField(default=0)
    class Meta:

        unique_together = ("user", "category")

    def __str__(self):

        return f"{self.user.email} - {self.category.name}"


class RecommendationLog(models.Model):
    user = models.ForeignKey(
        CustomUserModel,
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    recommendation_type = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:

        ordering = ["-created_at"]

    def __str__(self):

        return f"{self.user.email} -> {self.product.name}"


class Memory(models.Model):

    user = models.ForeignKey(
        CustomUserModel,
        on_delete=models.CASCADE,
        related_name="memories"
    )

    key = models.CharField(max_length=100)

    value = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "key")

    def __str__(self):
        return f"{self.user.email} - {self.key}" 


class KnowledgeChunk(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    embedding = VectorField(dimensions=768)
    source = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title    


#       python manage.py makemigrations ai_engine
#       python manage.py migrate ai_engine    
#       python manage.py runserver       
