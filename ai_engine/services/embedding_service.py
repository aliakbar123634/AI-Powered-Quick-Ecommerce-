# from sentence_transformers import SentenceTransformer
# from pgvector.django import CosineDistance
# from products.models import Product


# # Embedding model load hoga
# embedding_model = SentenceTransformer(
#     "BAAI/bge-base-en-v1.5"
# )


# def prepare_product_text(product):
#     """
#     Product ki important information ko
#     ek single text mein combine karta hai.
#     """

#     text = f"""
#     Product Name: {product.name}
#     Category: {product.category.name}
#     Brand: {product.brand or ""}
#     Description: {product.description or ""}
#     Price: {product.price}
#     """

#     return text.strip()


# def generate_embedding(text):
#     """
#     Text ko 768-dimensional embedding vector
#     mein convert karta hai.
#     """

#     embedding = embedding_model.encode(
#         text,
#         normalize_embeddings=True
#     )

#     return embedding.tolist()

# def search_similar_products(query, limit=5):

#     query_embedding = generate_embedding(query)

#     products = (
#         Product.objects
#         .filter(embedding__isnull=False)
#         .annotate(
#             distance=CosineDistance(
#                 "embedding",
#                 query_embedding
#             )
#         )
#         .order_by("distance")[:limit]
#     )

#     return products



from pgvector.django import CosineDistance
from products.models import Product


_embedding_model = None


def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        from sentence_transformers import SentenceTransformer

        _embedding_model = SentenceTransformer(
            "BAAI/bge-base-en-v1.5"
        )

    return _embedding_model


def prepare_product_text(product):
    """
    Product ki important information ko
    ek single text mein combine karta hai.
    """

    text = f"""
    Product Name: {product.name}
    Category: {product.category.name}
    Brand: {product.brand or ""}
    Description: {product.description or ""}
    Price: {product.price}
    """

    return text.strip()


def generate_embedding(text):
    """
    Text ko 768-dimensional embedding vector
    mein convert karta hai.
    """

    embedding_model = get_embedding_model()

    embedding = embedding_model.encode(
        text,
        normalize_embeddings=True
    )

    return embedding.tolist()


def search_similar_products(query, limit=5):

    query_embedding = generate_embedding(query)

    products = (
        Product.objects
        .filter(embedding__isnull=False)
        .annotate(
            distance=CosineDistance(
                "embedding",
                query_embedding
            )
        )
        .order_by("distance")[:limit]
    )

    return products