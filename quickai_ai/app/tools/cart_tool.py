import requests

from langchain_core.tools import tool
from langgraph.prebuilt import InjectedState

from app.core.config import settings

from typing import Annotated


@tool
def add_to_cart(
    product_id: int,
    quantity: int,
    token: Annotated[str, InjectedState("access_token")],
):
    """
    Add a product to the user's cart.

    The product_id must come from a previous product search.
    Never guess a product ID.
    """



    url = f"{settings.BACKEND_BASE_URL}/api/orders/cart/add/"

    print("Django URL:", url)

    try:

        response = requests.post(
            url=url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json={
                "product": product_id,
                "quantity": quantity,
            },
            timeout=10,
        )



        response.raise_for_status()


        return "Product added to cart successfully."

    except requests.RequestException as e:



        if e.response is not None:

            print("Status Code:", e.response.status_code)
            print("Response:", e.response.text)

        print("=" * 60)

        return "Failed to add product to cart."
