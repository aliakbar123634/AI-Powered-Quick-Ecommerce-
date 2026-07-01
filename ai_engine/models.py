from django.db import models
from accounts.models import CustomUserModel
from products.models import Product, Category


class SearchHistory(models.Model):
    user = models.ForeignKey(
        CustomUserModel,
        on_delete=models.CASCADE
    )

    search_query = models.CharField(max_length=255)

    searched_at = models.DateTimeField(auto_now_add=True)


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
