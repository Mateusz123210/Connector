from fastapi import FastAPI
from fastapi import BackgroundTasks
from fastapi import Depends
from fastapi import HTTPException
from app.mail import mail_sender
from contextlib import asynccontextmanager
from .database import SessionLocal, engine
from sqlalchemy.orm import Session
from . import crud
from .database import Base

background_tasks = None
data = []
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    data.append(BackgroundTasks())
    yield
    data.clear()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



app = FastAPI(lifespan = lifespan)

@app.post("/register")
async def register(db: Session = Depends(get_db)):
    pass
    # user="Adam"
    # db_user = crud.get_user_by_email(db, email=user)
    # if db_user:
    #     raise HTTPException(status_code=400, detail="Email already registered")
    # return crud.create_user(db=db, user=user)








    # mail_sender.send_email_with_verification_code_for_registration(data[0], '252808@student.pwr.edu.pl', '108356') 

    return {}
# 
@app.post("/login")
async def login():
    mail_sender.send_email_with_verification_code_for_login(data[0], '252808@student.pwr.edu.pl', '108356') 
    return {}

@app.post("/reset-password")
async def reset_password():
    mail_sender.send_email_with_verification_code_for_password_reset(data[0], '252808@student.pwr.edu.pl', '108356') 
    return {}

@app.post("/logout")
async def logout():
    pass

@app.post("/send-message")
async def send_message():
    return {}

@app.get("/get-message")
async def get_message():
    return {}



