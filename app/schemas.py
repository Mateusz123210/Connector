from pydantic import BaseModel

class Token(BaseModel):
    token: str

    class Config:
        from_attributes = True


class MessageSending(Token):
    first_user: str
    second_user: str
    message: str


    class Config:
        from_attributes = True


class MessagesFetching(Token):
    first_user: str
    second_user: str


    class Config:
        from_attributes = True


class MessagesDeleting(Token):
    user: str


    class Config:
        from_attributes = True
























# def invidual_serial(conversation) -> dict:
#     return {
#         "id": str(conversation["_id"]),
#         "first_user": conversation["first_user"],
#         "second_user": conversation["second_user"],
#         "messages_list": conversation["messages_list"]
#     }

# def list_serial(conversations) -> list:
#     return [invidual_serial(conversation for conversation in conversations)]