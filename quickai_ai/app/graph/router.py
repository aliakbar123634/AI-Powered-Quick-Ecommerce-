# 


from langchain_core.messages import ToolMessage


def should_continue(state):

    last_message = state["messages"][-1]

    # LLM requested a tool
    tool_calls = getattr(
        last_message,
        "tool_calls",
        None
    ) or []

    if tool_calls:
        return "tools"

    # Direct tool execution completed
    if isinstance(
        last_message,
        ToolMessage
    ):
        return "shopping_agent"

    return "__end__"