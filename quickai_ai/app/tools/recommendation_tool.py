    
from typing import Literal
import requests
import json

from langchain_core.tools import tool
from app.core.config import settings


@tool
def recommend_products(
    query: str,
    search_type: Literal["category", "product"]
):
    """
    Recommend products based on either a category or a specific product.

    search_type:
    - category: when query is a product category such as Fitness, Electronics, etc.
    - product: when query is a specific product such as Organic Honey, iPhone 15, etc.
    """

    try:
        url = f"{settings.BACKEND_BASE_URL}/api/products/products/recommendations/"

        response = requests.get(
            url=url,
            params={
                "search": query,
                "type": search_type,
            },
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        results = data.get("results", [])

        if not results:
            return "No matching products found."

        products = []

        for item in results[:5]:
            products.append({
                "id": item.get("id"),
                "name": item.get("name"),
                "brand": item.get("brand"),
                "price": item.get("price"),
                "discount_price": item.get("discount_price"),
                "rating": item.get("rating"),
                "stock": item.get("stock"),
            })

        return json.dumps(products, indent=2)

    except requests.RequestException as e:
        print(f"Recommendation API error: {e}")
        return "Backend API is unavailable."