from pydantic import BaseModel, Field
class MemoryExtraction(BaseModel):
    should_save: bool = Field(
        description="Whether the user's message contains a stable fact or preference worth remembering."
    )

    key: str | None = Field(
        default=None,
        description="The memory key, such as budget or favorite_brand."
    )

    value: str | None = Field(
        default=None,
        description="The value associated with the memory."
    )
