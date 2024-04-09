from pydantic import BaseModel, EmailStr, Field


class Conversation(BaseModel):
    first_user: EmailStr = Field()
    second_user: EmailStr = Field()
    messages_list: list = Field()


    class Config:
        json_schema_extra = {
            "example": {
                "first_user": "user_1@gmail.com",
                "second_user": "user_2@gmail.com",
                "messages_list": ["Hey", "Hey", "How are you?", "Everything ok"]
            }
        }