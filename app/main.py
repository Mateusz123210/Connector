from fastapi import FastAPI
from fastapi import Depends
import services
import uvicorn
from database import *
from schemas import *

app = FastAPI()

@app.post("/send-message")
async def send_message(data: MessageSending):
    return services.send_message(dict(data))

@app.get("/get-messages")
async def get_messages(data: MessagesFetching):
    return services.get_messages(dict(data))

@app.delete("/delete-messages")
async def delete_messages(data: MessagesDeleting):
    return services.delete_messages(dict(data))


if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0')