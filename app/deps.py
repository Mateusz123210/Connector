from schemas import MessageSending, MessagesDeleting, MessagesFetching
from fastapi import HTTPException
from cryptography.fernet import Fernet

key = b'upZ2aMX8yEawIy-fIE6AykvOhRvnbwEIjepwzmR1R3k='
f = Fernet(key)

with open("./app/keys/secret_key.env", "rb") as encrypted_file:
    encrypted = encrypted_file.read()

token = f.decrypt(encrypted).decode("utf-8")

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
