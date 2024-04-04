from fastapi import FastAPI
from fastapi import Depends
from fastapi import HTTPException
from app.mail import mail_sender
from fastapi.security import OAuth2PasswordRequestForm
from contextlib import asynccontextmanager
from .database import SessionLocal, engine
from sqlalchemy.orm import Session
from . import crud
from .database import Base
from app.mail.mail_sender_executor import MailSenderExecutor
from app.hashing.password_hasher import PasswordHasher
from app.validating import Validator
from app.random_numbers import verification_code_generator
from app.schemas import *
from datetime import datetime, timedelta, UTC

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(lifespan = lifespan)

@app.post("/register")
async def register(data: BasicAuthentication, db: Session = Depends(get_db)):
    if objects[2].validate_email(data.email) is False:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    db_user = crud.get_user_by_email(db, email=data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email unavailable")

    if objects[2].validate_password(data.password) is False:
        raise HTTPException(status_code=400, detail="Invalid password")
    
    hashed_password = objects[1].hash_password(data.password)
    verification_code = verification_code_generator.generate_verification_code()
    verification_code_expiration_time = datetime.now(UTC) + timedelta(minutes=15)

    crud.create_user(db, UserCreate(email=data.email, password=hashed_password, confirmation_code=verification_code,
                                confirmation_code_expiration_time=verification_code_expiration_time))



    # mail_sender.send_email_with_verification_code_for_registration(data[0], '252808@student.pwr.edu.pl', verification_code) 

    return {}

@app.post("/login")
async def login(data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.get(data.username, None)
    if user is None:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    





    # verification_code = verification_code_generator.generate_verification_code()

    # mail_sender.send_email_with_verification_code_for_login(data[0], '252808@student.pwr.edu.pl', verification_code) 
    return {}

@app.post("/reset-password")
async def reset_password(db: Session = Depends(get_db)):




    verification_code = verification_code_generator.generate_verification_code()

    mail_sender.send_email_with_verification_code_for_password_reset(data[0], '252808@student.pwr.edu.pl', verification_code) 
    return {}

@app.post("/logout")
async def logout(db: Session = Depends(get_db)):
    pass

@app.post("/send-message")
async def send_message():
    return {}

@app.get("/get-message")
async def get_message():
    return {}



