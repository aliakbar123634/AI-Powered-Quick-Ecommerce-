
# from langchain_core.messages import HumanMessage, SystemMessage

# from app.core.llm import llm
# from app.schemas.memory_schema import MemoryExtraction
# from app.prompts.memory_prompt import MEMORY_EXTRACTOR_PROMPT


# structured_llm = llm.with_structured_output(MemoryExtraction)


# def memory_extractor(state):

#     last_message = state["messages"][-1]

#     if not isinstance(last_message, HumanMessage):
#         return {
#             "memory_result": None
#         }

#     result = structured_llm.invoke([
#         SystemMessage(
#             content=MEMORY_EXTRACTOR_PROMPT
#         ),
#         HumanMessage(
#             content=last_message.content
#         )
#     ])

#     print("=" * 60)
#     print("MEMORY EXTRACTOR")
#     print("User:", last_message.content)
#     print("Result:", result)
#     print("=" * 60)

#     return {
#         "memory_result": result
#     }


from langchain_core.messages import SystemMessage
from pydantic import BaseModel, Field

from app.core.llm import llm


class MemoryExtraction(BaseModel):
    should_save: bool = Field(
        description="Whether the user's message contains a stable fact or preference worth remembering."
    )

    key: str = Field(
        default="",
        description="Memory key. Use empty string if should_save is false."
    )

    value: str = Field(
        default="",
        description="Memory value. Use empty string if should_save is false."
    )


structured_llm = llm.with_structured_output(MemoryExtraction)


def memory_extractor(state):

    user_message = state["messages"][-1].content

    print("=" * 60)
    print("MEMORY EXTRACTOR")
    print("User:", user_message)

    try:

        result = structured_llm.invoke([
            SystemMessage(
                content="""
You are a memory extraction system.

Your job is to detect whether the user's message contains
a stable personal fact, preference, or information that should
be remembered for future conversations.

IMPORTANT:

Always return ALL THREE fields:

should_save
key
value

If there is NO memory to save:

should_save = false
key = ""
value = ""

If there IS something worth remembering:

should_save = true
key = a short snake_case key
value = the user's actual value.

Examples:

User:
"My budget is 500 dollars."

Return:
should_save = true
key = "budget"
value = "500 dollars"

User:
"My favorite brand is Apple."

Return:
should_save = true
key = "favorite_brand"
value = "Apple"

User:
"I prefer black products."

Return:
should_save = true
key = "preferred_color"
value = "black"

User:
"Tell me about yourself."

Return:
should_save = false
key = ""
value = ""

User:
"Hi"

Return:
should_save = false
key = ""
value = ""

Do NOT invent memories.
Do NOT save temporary conversation content.
"""
            ),
            {
                "role": "user",
                "content": user_message
            }
        ])

        print(
            "Result:",
            result
        )

        print(
            "should_save:",
            result.should_save
        )

        print(
            "key:",
            result.key
        )

        print(
            "value:",
            result.value
        )

        print("=" * 60)

        return {
            "memory": result
        }

    except Exception as e:

        print("=" * 60)
        print("MEMORY EXTRACTION ERROR")
        print(type(e).__name__)
        print(str(e))
        print("Continuing without memory...")
        print("=" * 60)

        # VERY IMPORTANT:
        # Memory extraction failure should NEVER
        # break the complete chat request.

        return {
            "memory": MemoryExtraction(
                should_save=False,
                key="",
                value=""
            )
        }