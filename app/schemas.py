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
