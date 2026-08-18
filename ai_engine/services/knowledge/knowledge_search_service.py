from pgvector.django import CosineDistance

from ai_engine.models import KnowledgeChunk
from ai_engine.services.embedding_service import generate_embedding


def search_knowledge(query, limit=5):

    # 1. User query ko embedding mein convert karo
    query_embedding = generate_embedding(query)

    # 2. Database mein similarity search
    results = (
        KnowledgeChunk.objects
        .annotate(
            distance=CosineDistance(
                "embedding",
                query_embedding
            )
        )
        .order_by("distance")[:limit]
    )

    return results