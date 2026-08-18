from ai_engine.services.knowledge.knowledge_search_service import (
    search_knowledge
)

from ai_engine.services.llm_service import llm


def answer_from_knowledge(question, limit=5):

    # 1. User question ke relevant knowledge chunks retrieve karo
    chunks = search_knowledge(
        question,
        limit=limit
    )

    # 2. Retrieved chunks ko context mein convert karo
    context_parts = []

    for chunk in chunks:

        context_parts.append(
            f"Title: {chunk.title}\n"
            f"Content: {chunk.content}"
        )

    context = "\n\n".join(context_parts)

    # 3. Context + user question ko LLM prompt mein bhejo
    prompt = f"""
You are an AI assistant for an ecommerce store.

Answer the user's question using ONLY the provided knowledge context.

If the answer is not present in the context,
say that you don't have enough information.

Knowledge Context:
{context}

User Question:
{question}

Answer:
"""

    # 4. Groq Llama se final answer generate karo
    response = llm.invoke(prompt)

    return response.content