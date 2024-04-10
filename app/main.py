from fastapi import FastAPI
from fastapi import Depends
import services
import uvicorn
from schemas import MessageSending, MessagesDeleting, MessagesFetching
from deps import validate_token_for_message_fetching, validate_token_for_message_sending, \
    validate_token_for_messages_deleting

app = FastAPI()

@app.post("/send-message")
async def send_message(data: MessageSending = Depends(validate_token_for_message_sending)):
    return services.send_message(dict(data))

@app.post("/get-messages")
async def get_messages(data: MessagesFetching = Depends(validate_token_for_message_fetching)):
    return services.get_messages(dict(data))

@app.post("/delete-messages")
async def delete_messages(data: MessagesDeleting = Depends(validate_token_for_messages_deleting)):
    return services.delete_messages(dict(data))


if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0')
