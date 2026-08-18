import os
from langchain_groq import ChatGroq

from quickai_ai.app.core.config import settings

def build_llm():
    api_key = (
        settings.GROQ_API_KEY
        or os.getenv("GROQ_API_KEY")
        or ""
    )  
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not configured."
        )
    return ChatGroq(
        model=settings.MODEL_NAME,
        api_key=api_key,
        temperature=0,
        max_tokens=settings.MAX_TOKENS,
        max_retries=2,
    )
llm = build_llm()     
