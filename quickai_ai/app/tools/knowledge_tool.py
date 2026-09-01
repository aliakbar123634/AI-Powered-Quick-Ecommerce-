import requests

from langchain_core.tools import tool
from app.core.config import settings


@tool
def search_knowledge(query: str):
    """
    Search the ecommerce knowledge base.

    Use this when the user asks about store policies,
    returns, refunds, shipping, privacy, terms and conditions,
    or other general store information.
    """

    try:
        question = (query or "").strip()

        if not question:
            return "No question provided."



        url = (
            f"{settings.BACKEND_BASE_URL}"
            "/api/ai_engine/knowledge-chat/"
        )

        response = requests.post(
            url=url,
            json={
                "question": question
            },
            timeout=30,
        )

        response.raise_for_status()

        data = response.json()

        answer = data.get("answer")

        if not answer:
            return "No answer found in the knowledge base."



        return answer

    except requests.RequestException as e:


        return "Knowledge service is currently unavailable."


