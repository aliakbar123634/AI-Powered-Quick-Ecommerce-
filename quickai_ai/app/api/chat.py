from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel
from app.core.llm import llm
from app.graph.shopping_agent import shopping_agent
from app.graph.state import AgentState
from app.graph.graph import builder , graph
from langchain_core.messages import SystemMessage, HumanMessage
from app.prompts.shopping_prompt import SHOPPING_SYSTEM_PROMPT
from app.core.auth import get_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request


router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    







security = HTTPBearer()

@router.get("/test-header")
def test_header(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    return {
        "token": credentials.credentials
    }




@router.get("/allheaders")
async def all_headers(request: Request):
    return dict(request.headers)    












@router.post("/chat")
def chat(
    request: ChatRequest,
    access_token: str = Depends(get_access_token)
):

    print("\n" + "=" * 60)
    print("CHAT REQUEST")
    print("=" * 60)

    print("Message:", request.message)
    print("Token received:", access_token)
    print("Token length:", len(access_token) if access_token else 0)

    thread_id = access_token

    state: AgentState = {
        "message": request.message,
        "messages": [
            SystemMessage(content=SHOPPING_SYSTEM_PROMPT),
            HumanMessage(content=request.message)
        ],
        "intent": "",
        "current_tool": "",
        "products": [],
        "tool_result": None,
        "response": "",
        "access_token": access_token,
        "memory_result": None,
    }

    result = graph.invoke(
        state,
        config={
            "configurable": {
                "thread_id": thread_id
            }
        }
    )

    print("FINAL RESPONSE:")
    print(result["messages"][-1].content)

    # return {
    #     "response": result["messages"][-1].content
    # }
    final_response = result["messages"][-1].content

    if not isinstance(final_response, str):
        final_response = str(final_response)

    return {
        "response": final_response
    }