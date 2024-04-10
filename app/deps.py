from schemas import MessageSending, MessagesDeleting, MessagesFetching
from fastapi import HTTPException

with open("./app/keys/secret_key.env") as file:
    token = file.read()

def validate_token_for_message_sending(data: MessageSending):
    return validate_token(data)

def validate_token_for_message_fetching(data: MessagesFetching):
    return validate_token(data)

def validate_token_for_messages_deleting(data: MessagesDeleting):
    return validate_token(data)

def validate_token(data):
    if data.token != token:
        raise HTTPException(status_code=403, detail="Invalid credentials!")
    return data