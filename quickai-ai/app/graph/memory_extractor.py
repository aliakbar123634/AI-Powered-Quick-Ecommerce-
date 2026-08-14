
from langchain_core.messages import HumanMessage, SystemMessage

from app.core.llm import llm
from app.schemas.memory_schema import MemoryExtraction
from app.prompts.memory_prompt import MEMORY_EXTRACTOR_PROMPT


structured_llm = llm.with_structured_output(MemoryExtraction)


def memory_extractor(state):

    last_message = state["messages"][-1]

    if not isinstance(last_message, HumanMessage):
        return {
            "memory_result": None
        }

    result = structured_llm.invoke([
        SystemMessage(
            content=MEMORY_EXTRACTOR_PROMPT
        ),
        HumanMessage(
            content=last_message.content
        )
    ])

    print("=" * 60)
    print("MEMORY EXTRACTOR")
    print("User:", last_message.content)
    print("Result:", result)
    print("=" * 60)

    return {
        "memory_result": result
    }