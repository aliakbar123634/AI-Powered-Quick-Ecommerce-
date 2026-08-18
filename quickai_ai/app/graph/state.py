from typing import TypedDict, Annotated
from langgraph.graph import add_messages
from langchain_core.messages import BaseMessage
from app.schemas.memory_schema import MemoryExtraction
class AgentState(TypedDict):
    message:str
    # Full conversation history
    messages: Annotated[list[BaseMessage], add_messages]
    # User intent
    intent: str
    # Current tool selected
    current_tool: str
    products:list
    tool_result: dict | None
    response: str
    access_token: str
    memory_result: MemoryExtraction | None
