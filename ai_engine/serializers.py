from rest_framework import serializers
from .models import Memory
from .models import Memory
from .models import (
    SearchHistory,
    UserPreference,
    RecommendationLog
)


class SearchHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = SearchHistory
        fields = "__all__"
        read_only_fields = [
            "id",
            "user",
            "searched_at",
        ]


class UserPreferenceSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = UserPreference
        fields = [
            "id",
            "user",
            "category",
            "category_name",
            "score",
        ]
        read_only_fields = [
            "id",
            "user",
        ]


class RecommendationLogSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    class Meta:
        model = RecommendationLog
        fields = [
            "id",
            "user",
            "product",
            "product_name",
            "recommendation_type",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "created_at",
        ]

class MemorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Memory
        fields = [
            "id",
            "user",
            "key",
            "value",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]
