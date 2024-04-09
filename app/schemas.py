from pydantic import BaseModel


class MessageSending(BaseModel):
    first_user: str
    second_user: str
    message: str


    class Config:
        from_attributes = True


class MessagesFetching(BaseModel):
    first_user: str
    second_user: str


    class Config:
        from_attributes = True


class MessagesDeleting(BaseModel):
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