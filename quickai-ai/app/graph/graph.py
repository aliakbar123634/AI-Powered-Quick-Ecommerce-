


from langgraph.graph import StateGraph, END, START
from langgraph.prebuilt import ToolNode

from app.graph.state import AgentState
from app.graph.shopping_agent import shopping_agent
from app.graph.router import should_continue
from app.graph.memory_extractor import memory_extractor

from app.tools.search_tool import search_products
from app.tools.recommendation_tool import recommend_products
from app.tools.cart_tool import add_to_cart
from app.tools.memory_tool import save_memory, recall_memory
from langgraph.checkpoint.memory import InMemorySaver

tools = [
    search_products,
    recommend_products,
    add_to_cart,
    save_memory,
    recall_memory,
]

tool_node = ToolNode(tools)

builder = StateGraph(AgentState)

builder.add_node("memory_extractor", memory_extractor)
builder.add_node("shopping_agent", shopping_agent)
builder.add_node("tools", tool_node)

builder.add_edge(
    START,
    "memory_extractor"
)

builder.add_edge(
    "memory_extractor",
    "shopping_agent"
)

builder.add_conditional_edges(
    "shopping_agent",
    should_continue
)

builder.add_edge(
    "tools",
    "shopping_agent"
)
checkpointer = InMemorySaver()
graph = builder.compile(checkpointer=checkpointer)