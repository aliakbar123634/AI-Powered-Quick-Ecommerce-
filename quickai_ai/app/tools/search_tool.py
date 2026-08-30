import json
import re
import requests

from langchain_core.tools import tool
from app.core.config import settings


def normalize_search_query(query: str) -> str:

    text = (query or "").strip()

    if not text:
        return ""

    text = re.sub(r"\s+", " ", text).strip()

    prefixes = [
        "do you have",
        "do you sell",
        "is there",
        "are there",
        "can i get",
        "can you find",
        "can you show me",
        "can you search for",

        "show me",
        "show me some",
        "show me a",
        "show me an",
        "find me",
        "find",
        "look for",
        "search for",
        "search",
        "i want",
        "i would like",
        "give me",
    ]

    lowered = text.lower()

    for prefix in prefixes:

        if lowered.startswith(prefix):
            text = text[len(prefix):].strip()
            break

    text = re.sub(
        r"^(some|a|an|the)\b",
        "",
        text,
        flags=re.IGNORECASE
    ).strip()

    text = re.sub(
        r"\b(product|products|item|items)\b",
        "",
        text,
        flags=re.IGNORECASE
    ).strip()

    text = text.rstrip("?").strip()

    return text


@tool
def search_products(query: str):
    """
    Search the product catalog.

    Use this when the user asks whether a specific product
    exists, wants product details, or wants a product price.
    """

    try:

        search_term = normalize_search_query(query)

        print("=" * 50)
        print("SEARCH TOOL CALLED")
        print("Original query:", query)
        print("Normalized query:", search_term)
        print("=" * 50)

        if not search_term:
            return "No search query provided."

        # =====================================================
        # 1. SEMANTIC SEARCH
        # =====================================================

        semantic_url = (
            f"{settings.BACKEND_BASE_URL}"
            "/api/products/semantic-search/"
        )

        response = requests.get(
            url=semantic_url,
            params={
                "q": search_term
            },
            timeout=20,
        )

        response.raise_for_status()

        data = response.json()

        results = data.get("results", [])

        print(
            "Matching semantic products found:",
            len(results)
        )

        # =====================================================
        # 2. IF SEMANTIC SEARCH FINDS PRODUCTS
        # =====================================================

        if results:

            products = []

            for item in results[:5]:

                products.append({
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "price": item.get("price"),
                    "category": item.get("category"),
                })

            return json.dumps(
                products,
                indent=2
            )

        # =====================================================
        # 3. SEMANTIC SEARCH FAILED
        #    → EXACT / NORMAL SEARCH FALLBACK
        # =====================================================

        print("=" * 50)
        print("SEMANTIC SEARCH RETURNED 0 RESULTS")
        print("Trying normal product search...")
        print("Search term:", search_term)
        print("=" * 50)

        fallback_url = (
            f"{settings.BACKEND_BASE_URL}"
            "/api/products/products/"
        )

        fallback_response = requests.get(
            url=fallback_url,
            params={
                "search": search_term
            },
            timeout=10,
        )

        fallback_response.raise_for_status()

        fallback_data = fallback_response.json()

        if isinstance(fallback_data, dict):
            fallback_results = (
                fallback_data.get("results") or []
            )
        elif isinstance(fallback_data, list):
            fallback_results = fallback_data
        else:
            fallback_results = []

        print(
            "Normal search products found:",
            len(fallback_results)
        )

        if not fallback_results:
            return "No products found."

        products = []

        for item in fallback_results[:5]:

            products.append({
                "id": item.get("id"),
                "name": item.get("name"),
                "price": item.get("price"),
                "discount_price": item.get(
                    "discount_price"
                ),
                "brand": item.get("brand"),
                "stock": item.get("stock"),
            })

        return json.dumps(
            products,
            indent=2
        )

    except requests.RequestException as e:

        print(
            f"Product search API error: {e}"
        )

        if e.response is not None:
            print(
                "Status:",
                e.response.status_code
            )
            print(
                "Response:",
                e.response.text
            )

        return "Backend API is unavailable."