from fastapi import FastAPI
from fastapi import BackgroundTasks
from app.mail import mail_sender
from contextlib import asynccontextmanager

background_tasks = None
data = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    data.append(BackgroundTasks())
    yield
    data.clear()

app = FastAPI(lifespan = lifespan)


@app.post("/register")
async def register():











    mail_sender.send_email_with_verification_code_for_registration(data[0], '252808@student.pwr.edu.pl', '108356') 

    return {}

@app.post("/login")
async def login():
    mail_sender.send_email_with_verification_code_for_login(data[0], '252808@student.pwr.edu.pl', '108356') 
    return {}

@app.post("/reset-password")
async def reset_password():
    mail_sender.send_email_with_verification_code_for_password_reset(data[0], '252808@student.pwr.edu.pl', '108356') 
    return {}

@app.post("/send-message")
async def send_message():
    return {}

@app.get("/get-message")
async def get_message():
    return {}



