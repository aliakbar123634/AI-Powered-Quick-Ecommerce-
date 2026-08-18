from ai_engine.services.embedding_service import (
    search_similar_products
)

from ai_engine.services.llm_service import llm

def generate_ai_response(user_query):
    # Step 1: Semantic Search
    products = search_similar_products(user_query)    
    # Step 2: Agar products nahi mile
    if not products:

        return {
            "answer": "Sorry, mujhe relevant products nahi mile.",
            "products": []
        }
    product_context = []
    for product in products:

        product_context.append(
            f"""
Product ID: {product.id}
Name: {product.name}
Category: {product.category.name}
Brand: {product.brand}
Price: {product.price}
Description: {product.description}
"""
        )
    product_context = "\n".join(product_context)

    # Step 4: Groq ko context dena
    prompt = f"""
You are an AI ecommerce assistant.

The customer asked:

{user_query}

Here are the products found from the ecommerce database:

{product_context}

Answer the customer's question using ONLY the products provided above.

Do not invent products or prices.

Be helpful and concise.

If a product is relevant, explain briefly why it matches the customer's request.
"""
    response = llm.invoke(prompt)

    # Step 6: Final response
    return {
        "answer": response.content,
        "products": [
            {
                "id": product.id,
                "name": product.name,
                "price": str(product.price),
            }
            for product in products
        ]
    }