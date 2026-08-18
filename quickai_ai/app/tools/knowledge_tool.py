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

        print("=" * 50)
        print("KNOWLEDGE TOOL CALLED")
        print("Question:", question)
        print("=" * 50)

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

        print("Knowledge answer:", answer)

        return answer

    except requests.RequestException as e:

        print(
            f"Knowledge API error: {e}"
        )

        return "Knowledge service is currently unavailable."


# from app.tools.knowledge_tool import knowledge_search
# from langchain_core.tools import tool

# @tool
# def knowledge_search(question: str) -> str:
#     """
#     Search the store knowledge base for policies and other store information.
#     Use this for questions about return, refund, shipping, privacy,
#     terms and conditions, and other store policies.
#     """

#     print("\n" + "=" * 50)
#     print("KNOWLEDGE TOOL CALLED")
#     print(f"Question: {question}")
#     print("=" * 50)

#     # yahan tumhara Django endpoint call hoga
#     answer = call_django_knowledge_api(question)

#     print("Knowledge answer:", answer)

#     return answer