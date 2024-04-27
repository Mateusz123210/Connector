from fastapi import FastAPI
from fastapi import Depends
import services
import uvicorn
from schemas import MessageSending, MessagesDeleting, MessagesFetching
from deps import validate_token_for_message_fetching, validate_token_for_message_sending, \
    validate_token_for_messages_deleting
from fastapi.middleware.cors import CORSMiddleware
import ssl

app = FastAPI()

origins = [
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

@app.post("/send-message")
async def send_message(data: MessageSending = Depends(validate_token_for_message_sending)):
    return services.send_message(dict(data))

@app.post("/get-messages")
async def get_messages(data: MessagesFetching = Depends(validate_token_for_message_fetching)):
    return services.get_messages(dict(data))

@app.post("/delete-messages")
async def delete_messages(data: MessagesDeleting = Depends(validate_token_for_messages_deleting)):
    return services.delete_messages(dict(data))

ssl_certfile = './app/ssl_certificate/cert.cer'
ssl_keyfile = './app/ssl_certificate/key.pem'

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain(certfile=ssl_certfile, keyfile=ssl_keyfile)


if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0', ssl_certfile=ssl_certfile, ssl_keyfile=ssl_keyfile)
