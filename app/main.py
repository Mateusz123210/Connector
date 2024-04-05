from fastapi import FastAPI
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from contextlib import asynccontextmanager
from .database import engine
from .database import Base
from app.mail.mail_sender_executor import MailSenderExecutor
from app.hashing.password_hasher import PasswordHasher
from app.validating import Validator
from app.schemas import *
from . import services

objects = []
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    objects.append(MailSenderExecutor())
    objects.append(PasswordHasher())
    objects.append(Validator())
    yield
    objects[0].quit_connection_with_email_server()
    objects.clear()

app = FastAPI(lifespan = lifespan)

@app.post("/register")
async def register(data: BasicAuthentication):
    return services.register(data)

@app.post("/confirm-registration")
async def confirm_registration():
    return services.confirm_registration()

@app.post("/login")
async def login(data: OAuth2PasswordRequestForm = Depends()):
    return services.login(data)

@app.post("/confirm-login")
async def confirm_login():
    return services.confirm_login()

@app.post("/reset-password")
async def reset_password():
    return services.reset_password()

@app.post("/confirm-reset-password")
async def confirm_reset_password():
    return services.confirm_reset_password()

@app.post("/logout")
async def logout():
    return services.logout()

@app.post("/send-message")
async def send_message():
    return services.send_message()

@app.get("/get-messages")
async def get_messages():
    return services.get_messages()
