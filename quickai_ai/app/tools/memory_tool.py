import requests
from langchain_core.tools import tool
from langgraph.prebuilt import InjectedState
from typing import Annotated
from app.core.config import settings

@tool
def save_memory(key:str , value: str ,token: Annotated[str, InjectedState("access_token")] ):
    """
    Save user memory.

    Use this tool whenever the user asks you to remember something.

    Examples:
    - Remember my budget is 500 dollars.
    - My favorite brand is Apple.
    - Save my preferred color as black.
    """
    try:
        url=f"{settings.BACKEND_BASE_URL}/api/ai_engine/memory/save/"
        response=requests.post(
            url=url,
            headers={
                "Authorization": f"Bearer {token}"
            },  
            json={
                "key": key,
                "value": value
            }, 
            timeout=10              
        )
        response.raise_for_status()
        return "Memory saved successfully."
    except requests.RequestException as e:
        print(e)

        if e.response:
            print(e.response.status_code)
            print(e.response.text)

        return "Failed to save memory."    


@tool
def recall_memory(
    key: str,
    token: Annotated[str, InjectedState("access_token")]
):
    """
    Recall previously saved memory.
    """

    try:
        url = f"{settings.BACKEND_BASE_URL}/api/ai_engine/memory/recall/"

        response = requests.get(
            url=url,
            headers={
                "Authorization": f"Bearer {token}"
            },
            params={
                "key": key
            },
            timeout=10
        )

        # Memory simply doesn't exist
        if response.status_code == 404:
            return None

        response.raise_for_status()

        return response.json()

    except requests.RequestException as e:

        print("Memory recall error:", e)

        if e.response:
            print("Status:", e.response.status_code)
            print("Response:", e.response.text)

        return None        


