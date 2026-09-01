
# from langchain_core.messages import SystemMessage
# from pydantic import BaseModel, Field

# from app.core.llm import llm


# class MemoryExtraction(BaseModel):
#     should_save: bool = Field(
#         description="Whether the user's message contains a stable fact or preference worth remembering."
#     )

#     key: str = Field(
#         default="",
#         description="Memory key. Use empty string if should_save is false."
#     )

#     value: str = Field(
#         default="",
#         description="Memory value. Use empty string if should_save is false."
#     )


# structured_llm = llm.with_structured_output(MemoryExtraction)


# def memory_extractor(state):

#     user_message = state["messages"][-1].content



#     try:

#         result = structured_llm.invoke([
#             SystemMessage(
#                 content="""
# You are a memory extraction system.

# Your job is to detect whether the user's message contains
# a stable personal fact, preference, or information that should
# be remembered for future conversations.

# IMPORTANT:

# Always return ALL THREE fields:

# should_save
# key
# value

# If there is NO memory to save:

# should_save = false
# key = ""
# value = ""

# If there IS something worth remembering:

# should_save = true
# key = a short snake_case key
# value = the user's actual value.

# Examples:

# User:
# "My budget is 500 dollars."

# Return:
# should_save = true
# key = "budget"
# value = "500 dollars"

# User:
# "My favorite brand is Apple."

# Return:
# should_save = true
# key = "favorite_brand"
# value = "Apple"

# User:
# "I prefer black products."

# Return:
# should_save = true
# key = "preferred_color"
# value = "black"

# User:
# "Tell me about yourself."

# Return:
# should_save = false
# key = ""
# value = ""

# User:
# "Hi"

# Return:
# should_save = false
# key = ""
# value = ""

# Do NOT invent memories.
# Do NOT save temporary conversation content.
# """
#             ),
#             {
#                 "role": "user",
#                 "content": user_message
#             }
#         ])



#         return {
#             "memory_result": None
#         }

#     except Exception as e:



#         # VERY IMPORTANT:
#         # Memory extraction failure should NEVER
#         # break the complete chat request.

#         return {
#             "memory": MemoryExtraction(
#                 should_save=False,
#                 key="",
#                 value=""
#             )
#         }













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

        # IMPORTANT:
        # Return the actual extraction result.
        return {
            "memory_result": result
        }

    except Exception as e:

        print(f"Memory extraction error: {e}")

        # Memory extraction failure should NEVER
        # break the complete chat request.

        return {
            "memory_result": MemoryExtraction(
                should_save=False,
                key="",
                value=""
            )
        }